import { db } from "@/db";
import { assets } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq, isNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function deleteAsset(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {

    const [existingAsset] = await db
      .select({ id: assets.id })
      .from(assets)
      .where(and(eq(assets.id, params.id), isNull(assets.deletedAt)))
      .limit(1);

    if (!existingAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const result = await db
        .update(assets)
        .set({ 
            deletedAt: new Date(),
            deletedBy: session.user.id,
            updatedAt: new Date(),
        })
        .where(eq(assets.id, params.id))
        .returning();

    return NextResponse.json(
      {asset: result,  message: "Asset deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting asset:", error);
    return NextResponse.json(
      { error: "Failed to delete asset" },
      { status: 500 }
    );
  }
}
