import { db } from "@/db";
import { assetAssignment, assets, employees } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const [employee] = await db
      .select({
        id: employees.id,
        name: employees.name,
        email: employees.email,
        phoneNo: employees.phoneNo,
        status: employees.status,
        type: employees.employeeType,
        createdAt: employees.createdAt,
      })
      .from(employees)
      .where(eq(employees.id, params.id));

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    const assignmentEvents = await db
      .select({
        eventId: assetAssignment.id,
        assetId: assets.id,
        brand: assets.brand,
        model: assets.model,
        type: assets.type,
        serialNo: assets.serialNo,
        status: assets.status,
        assignedAt: assetAssignment.assignedOn,
        returnedAt: assetAssignment.returnedOn,
        assignedById: assetAssignment.assignedById,
        createdAt: assetAssignment.createdAt,
      })
      .from(assetAssignment)
      .innerJoin(assets, eq(assetAssignment.assetId, assets.id))
      .where(eq(assetAssignment.employeeId, employee.id));

    const assignedAssets = assignmentEvents.filter(
      (event) => event.returnedAt === null
    );

    return NextResponse.json(
      { employee, assignedAssets, assignmentEvents },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json(
      { error: "Failed to fetch employee" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    if (data.deletedAt || data.deleteReason) {
      updateData.deletedBy = session?.user?.id;
    }

    const [updatedEmployee] = await db
      .update(employees)
      .set(updateData)
      .where(eq(employees.id, params.id))
      .returning();

    if (!updatedEmployee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedEmployee, { status: 200 });
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}
