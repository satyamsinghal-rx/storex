import { db } from "@/db";
import { assets, assetService } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq, isNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { remark, servicePrice } = await request.json();

    if (!remark || !servicePrice) {
      return NextResponse.json(
        { error: "Remark and service price are required" },
        { status: 400 }
      );
    }

    const [existingAsset] = await db
      .select({
        id: assets.id,
        isAvailable: assets.isAvailable,
        status: assets.status,
      })
      .from(assets)
      .where(and(eq(assets.id, params.id), isNull(assets.deletedAt)))
      .limit(1);

    if (!existingAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const result = await db.transaction(async (tx) => {
      const [updatedAsset] = await tx
        .update(assets)
        .set({
          isAvailable: true,
          status: "available",
          updatedAt: new Date(),
        })
        .where(eq(assets.id, params.id))
        .returning();

      const [serviceAsset] = await tx
        .update(assetService)
        .set({
          receivedOn: new Date(),
          servicePrice: servicePrice,
          remark: remark,
          updatedAt: new Date(),
        })
        .where(and(eq(assetService.assetId, params.id), isNull(assetService.receivedOn)))
        .returning();

      return { updatedAsset, serviceAsset };
    });

    return NextResponse.json(
      {
        asset: result.updatedAsset,
        serviceAsset: result.serviceAsset,
        message: "Asset received from service successfully",
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating asset:", error);
    return NextResponse.json(
      { error: "Failed to update asset" },
      { status: 500 }
    );
  }
}
