import { db } from "@/db";
import { assetAssignment, assets } from "@/db/schema";
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

    const result = await db.transaction(async (tx) => {
      const [updatedAsset] = await tx
        .update(assets)
        .set({
          updatedAt: new Date(),
          isAvailable: true,
          status: "available",
          assignedTo: null,
        })
        .where(eq(assets.id, params.id))
        .returning();

      const [updatedAssignment] = await tx
        .update(assetAssignment)
        .set({
          returnedOn: new Date(),
        })
        .where(
          and(
            eq(assetAssignment.assetId, params.id),
            isNull(assetAssignment.returnedOn)
          )
        )
        .returning();

      return { updatedAsset, updatedAssignment };
    });

    return NextResponse.json(
      {
        asset: result.updatedAsset,
        assignment: result.updatedAssignment,
        message: "Asset returned successfully",
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
