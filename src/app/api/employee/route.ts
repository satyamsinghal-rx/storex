import { db } from "@/db";
import { employees } from "@/db/schema";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    if(!data.email || !data.name) {
      return NextResponse.json(
        { message: "Email and name are required" },
        { status: 400 }
      );
    }

    const existingEmployee = await db
      .select()
      .from(employees)
      .where(eq(employees.email, data.email))
      .execute();

    if (existingEmployee.length > 0) {
      return NextResponse.json(
        { message: "Employee already exists" },
        { status: 409 }
      );
    }

    const [newEmployee] = await db
      .insert(employees)
      .values({
        ...data,
        createdBy: session?.user?.id,
      })
      .returning();

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}

export async function GET() {
    const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try{
    const employeesList = await db
      .select()
      .from(employees)
      .execute();
      return NextResponse.json(employeesList, { status: 201 });

  } catch(error){
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}
