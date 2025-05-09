import { db } from "@/db";
import { assetAssignment, assets, employees } from "@/db/schema";
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
    const { employeeId } = await request.json();

    if (!employeeId) {
      return NextResponse.json(
        { error: "Assigned user is required" },
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
        { error: "Asset is not available for assignment" },
        { status: 400 }
      );
    }

    const [existingEmployee] = await db
      .select({
        id: employees.id,
      })
      .from(employees)
      .where(
        and(
          eq(employees.id, employeeId),
          isNull(employees.deletedAt),
          eq(employees.status, "active")
        )
      );

    if (!existingEmployee) {
      return NextResponse.json(
        { error: "Employee not found or inactive" },
        { status: 404 }
      );
    }

    const result = await db.transaction(async (tx) => {
      const [updatedAsset] = await tx
        .update(assets)
        .set({
          isAvailable: false,
          status: "assigned",
          updatedAt: new Date(),
        })
        .where(eq(assets.id, params.id))
        .returning();

      const [assignedAsset] = await tx
        .insert(assetAssignment)
        .values({
          assetId: params.id,
          employeeId: employeeId,
          assignedById: session?.user?.id ?? "",
          assignedOn: new Date(),
          updatedAt: new Date(),
          createdAt: new Date(),
        })
        .returning();

      return { updatedAsset, assignedAsset };
    });

    return NextResponse.json({
      asset: result.updatedAsset,
      assignment: result.assignedAsset,
    });
  } catch (error) {
    console.error("Error assigning asset:", error);
    return NextResponse.json(
      { error: "Failed to assign asset" },
      { status: 500 }
    );
  }
}
