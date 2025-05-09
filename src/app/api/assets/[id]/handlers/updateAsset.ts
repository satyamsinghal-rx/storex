import { db } from "@/db";
import {
  accessoriesSpecs,
  assets,
  hardDiskSpecifications,
  laptopSpecs,
  mobileSpecs,
  monitorSpecs,
  pendriveSpecs,
  ramSpecs,
  simSpecs,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const specTables: Record<
  string,
  | typeof laptopSpecs
  | typeof mobileSpecs
  | typeof monitorSpecs
  | typeof pendriveSpecs
  | typeof simSpecs
  | typeof accessoriesSpecs
  | typeof ramSpecs
  | typeof hardDiskSpecifications
> = {
  laptop: laptopSpecs,
  mobile: mobileSpecs,
  monitor: monitorSpecs,
  pendrive: pendriveSpecs,
  sim: simSpecs,
  accessories: accessoriesSpecs,
  ram: ramSpecs,
  hardisk: hardDiskSpecifications,
};


async function upsertSpec<T extends Record<string, unknown>>(
  assetId: string,
  type: string,
  data: T
) {
  const table = specTables[type];
  if (!table) {
    throw new Error(`No table found for type: ${type}`);
  }

  const [existing] = await db
    .select({
      id: table.id,
    })
    .from(table)
    .where(eq(table.assetId, assetId));

    const specData = { ...data };


  if (existing) {
    const [result] = await db
      .update(table)
      .set(data)
      .where(eq(table.assetId, assetId))
      .returning();
    return result;
  } else {
    const [result] = await db
      .insert(table)
      .values({
        assetId,
        ...specData,
      })
      .returning();
    return result;
  }
}

async function deleteSpec(assetId: string, type: string) {
  const table = specTables[type];
  if (!table) {
    throw new Error(`No table found for type: ${type}`);
  }

  await db.delete(table).where(eq(table.assetId, assetId));
}

export async function handleAssetPatch(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { specifications, ...assetData } = await request.json();

    const existingAsset = await db
      .select()
      .from(assets)
      .where(eq(assets.id, params.id));

    if (!existingAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const updateAsset = {
      updatedAt: new Date(),
      ...Object.fromEntries(
        Object.entries(assetData).filter(([, value]) => value !== undefined)
      ),
    };

    const targetType = assetData.type || existingAsset[0].type;

    const result = await db.transaction(async (tx) => {
      const [updatedAsset] = await tx
        .update(assets)
        .set(updateAsset)
        .where(eq(assets.id, params.id))
        .returning({
          id: assets.id,
          brand: assets.brand,
          model: assets.model,
          serialNo: assets.serialNo,
          type: assets.type,
          status: assets.status,
          purchaseDate: assets.purchaseDate,
          warrantyStartDate: assets.warrantyStartDate,
          warrantyExpiryDate: assets.warrantyExpiryDate,
          isAvailable: assets.isAvailable,
          ownedBy: assets.ownedBy,
          clientName: assets.clientName,
          assetPic: assets.assetPic,
          updatedAt: assets.updatedAt,
        });

      let updatedSpecifications = null;
      if (specifications && Object.keys(specifications).length > 0) {
        if (assetData.type && assetData.type !== existingAsset[0].type) {
          await deleteSpec(params.id, existingAsset[0].type);
        }
        updatedSpecifications = await upsertSpec(
          params.id,
          targetType,
          specifications
        );
      }

      return { updatedAsset, updatedSpecifications };
    });

    return NextResponse.json({
      asset: result.updatedAsset,
      specifications: result.updatedSpecifications,
    });
  } catch (error) {
    console.error("Error updating asset:", error);
    return NextResponse.json(
      { error: "Failed to update asset" },
      { status: 500 }
    );
  }
}
