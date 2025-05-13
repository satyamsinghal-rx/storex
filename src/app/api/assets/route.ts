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
import {inArray, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

const specTables = {
  laptop: laptopSpecs,
  mobile: mobileSpecs,
  monitor: monitorSpecs,
  pendrive: pendriveSpecs,
  sim: simSpecs,
  accessories: accessoriesSpecs,
  ram: ramSpecs,
  hardisk: hardDiskSpecifications,
};

type AssetType = "laptop" | "mobile" | "monitor" | "pendrive" | "sim" | "accessories" | "ram" | "hardisk";


const specFields = {
  laptop: {
    assetId: laptopSpecs.assetId,
    series: laptopSpecs.series,
    processor: laptopSpecs.processor,
    ram: laptopSpecs.ram,
    os: laptopSpecs.os,
    screenRes: laptopSpecs.screenRes,
    storage: laptopSpecs.storage,
    charger: laptopSpecs.charger,
  },
  mobile: {
    assetId: mobileSpecs.assetId,
    osType: mobileSpecs.osType,
    imei1: mobileSpecs.imei1,
    imei2: mobileSpecs.imei2,
    imei3: mobileSpecs.imei3,
  },
  monitor: {
    assetId: monitorSpecs.assetId,
    screenRes: monitorSpecs.screenRes,
  },
  pendrive: {
    assetId: pendriveSpecs.assetId,
    storage: pendriveSpecs.storage,
  },
  sim: {
    assetId: simSpecs.assetId,
    simno: simSpecs.simno,
    phone: simSpecs.phone,
  },
  accessories: {
    assetId: accessoriesSpecs.assetId,
    type: accessoriesSpecs.type,
    remark: accessoriesSpecs.remark,
  },
  ram: {
    assetId: ramSpecs.assetId,
    capacity: ramSpecs.capacity,
    remark: ramSpecs.remark,
  },
  hardisk: {
    assetId: hardDiskSpecifications.assetId,
    storage: hardDiskSpecifications.storage,
    type: hardDiskSpecifications.type,
  },
};

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const assetsList = await db
      .select({
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
        assignedTo: assets.assignedTo,
        ownedBy: assets.ownedBy,
        clientName: assets.clientName,
        assetPic: assets.assetPic,
        updatedAt: assets.updatedAt,
      })
      .from(assets)
      .where(isNull(assets.deletedAt));

    if (!assetsList.length) {
      return NextResponse.json([], { status: 200 });
    }
    

    const assetsByType = assetsList.reduce<Record<AssetType, string[]>>((acc, asset) => {
      (acc[asset.type] || []).push(asset.id);
      return acc;
    }, {
      laptop: [], mobile: [], monitor: [], pendrive: [],
      sim: [], accessories: [], ram: [], hardisk: []
    });

   const specPromises = (Object.keys(specTables) as AssetType[]).map(async (type) => {
      const ids = assetsByType[type];
      if (!ids.length) return [type, []];

      const specs = await db
      .select(specFields[type])
        .from(specTables[type])
        .where(inArray(specTables[type].assetId, ids));

      return [type, specs] as const;
    });

    const specsArray = await Promise.all(specPromises);
    const specifications = Object.fromEntries(specsArray);

    const result = assetsList.map((asset) => {
      const spec = (specifications[asset.type] as { assetId: string }[] | undefined)?.find((s) => s.assetId === asset.id) ?? null;
      return { ...asset, specifications: spec };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error getting assets:", error);
    return NextResponse.json({ error: "Could not get assets" }, { status: 500 });
  }
}


export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    const {
      brand,
      model,
      serialNo,
      type,
      status,
      purchaseDate,
      warrantyStartDate,
      warrantyExpiryDate,
      isAvailable,
      ownedBy,
      clientName,
      assetPic,
      specifications,
    } = data;

    const parsedPurchaseDate = new Date(purchaseDate);
    const parsedWarrantyStartDate = warrantyStartDate
      ? new Date(warrantyStartDate)
      : null;
    const parsedWarrantyExpiryDate = warrantyExpiryDate
      ? new Date(warrantyExpiryDate)
      : null;

    if (
      isNaN(parsedPurchaseDate.getTime()) ||
      (warrantyStartDate && isNaN(parsedWarrantyStartDate?.getTime() ?? NaN)) ||
      (warrantyExpiryDate && isNaN(parsedWarrantyExpiryDate?.getTime() ?? NaN))
    ) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const [newAsset] = await db
      .insert(assets)
      .values({
        brand,
        model,
        serialNo,
        type,
        status,
        purchaseDate: parsedPurchaseDate,
        warrantyStartDate: parsedWarrantyStartDate,
        warrantyExpiryDate: parsedWarrantyExpiryDate,
        isAvailable,
        ownedBy,
        clientName,
        assetPic,
        createdBy: session?.user?.id,
      })
      .returning();

    const specPayload = { assetId: newAsset.id, ...specifications };

    const specTableMap: 
      Record<string, typeof laptopSpecs | typeof mobileSpecs | typeof monitorSpecs | typeof pendriveSpecs | 
      typeof simSpecs | typeof accessoriesSpecs | typeof ramSpecs | typeof hardDiskSpecifications> = {

      laptop: laptopSpecs,
      mobile: mobileSpecs,
      monitor: monitorSpecs,
      pendrive: pendriveSpecs,
      sim: simSpecs,
      accessories: accessoriesSpecs,
      ram: ramSpecs,
      hardisk: hardDiskSpecifications,
      
    };

    const table = specTableMap[type];

    if (!table) {
      return NextResponse.json(
        { error: "Invalid asset type" },
        { status: 400 }
      );
    }

    await db.insert(table).values(specPayload);

    return NextResponse.json(
      { message: "Asset created successfully", asset: newAsset },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating asset:", error);
    return NextResponse.json(
      { error: "Failed to create asset" },
      { status: 500 }
    );
  }
}
