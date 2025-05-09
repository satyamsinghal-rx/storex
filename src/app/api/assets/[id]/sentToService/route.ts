import { db } from "@/db";
import { assets, assetService } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq, isNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { serviceReason } = await request.json();

    if (!serviceReason) {
      return NextResponse.json(
        { error: "Service Reason and Date is required" },
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

    if (
      existingAsset.isAvailable === false ||
      existingAsset.status === "assigned"
    ) {
      return NextResponse.json(
        { error: "Asset is not available for service" },
        { status: 400 }
      );
    }

    const result = await db.transaction(async (tx) => {
      const [updatedAsset] = await tx
        .update(assets)
        .set({
          isAvailable: false,
          status: "service",
          updatedAt: new Date(),
        })
        .where(eq(assets.id, params.id))
        .returning();

      const [serviceAsset] = await tx
        .insert(assetService)
        .values({
          assetId: params.id,
          sentBy: session?.user?.id ?? "",
          serviceReason: serviceReason,
          sentOn: new Date(),
          updatedAt: new Date(),
          createdAt: new Date(),
        })
        .returning();

      return { updatedAsset, serviceAsset };
    });

    return NextResponse.json({
      asset: result.updatedAsset,
      service: result.serviceAsset,
    });
  } catch (error) {
    console.error("Error assigning asset:", error);
    return NextResponse.json(
      { error: "Failed to assign asset" },
      { status: 500 }
    );
  }
}
