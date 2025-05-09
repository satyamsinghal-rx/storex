import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { assets } from "@/db/schema";
import { auth } from "@/lib/auth";
import { isNull } from "drizzle-orm";

type AssetType =
  | "laptop"
  | "mobile"
  | "monitor"
  | "pendrive"
  | "sim"
  | "accessories"
  | "ram"
  | "hardisk";
type DashboardTab = "total" | "assigned" | "available";

const assetTypes: AssetType[] = [
  "laptop",
  "mobile",
  "monitor",
  "pendrive",
  "sim",
  "accessories",
  "ram",
  "hardisk",
];

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json(
      { message: "You need to log in" },
      { status: 401 }
    );
  }

  try {
    const url = new URL(request.url);
    const tab = (url.searchParams.get("tab") || "total") as DashboardTab;

    if (!["total", "assigned", "available"].includes(tab)) {
      return NextResponse.json(
        { error: "Invalid tab value. Use 'total', 'assigned', or 'available'" },
        { status: 400 }
      );
    }

    const allAssets = await db
      .select({
        type: assets.type,
        isAvailable: assets.isAvailable,
      })
      .from(assets)
      .where(isNull(assets.deletedAt));

    const initByType = (): Record<AssetType, number> =>
      assetTypes.reduce((acc, type) => {
        acc[type] = 0;
        return acc;
      }, {} as Record<AssetType, number>);

    const byTypeTotal = initByType();
    const byTypeAssigned = initByType();
    const byTypeAvailable = initByType();

    for (const asset of allAssets) {
      const type = asset.type as AssetType;
      if (!assetTypes.includes(type)) continue;

      byTypeTotal[type]++;
      if (asset.isAvailable) {
        byTypeAvailable[type]++;
      } else {
        byTypeAssigned[type]++;
      }
    }

    const totalCount = allAssets.length;
    const assignedCount = Object.values(byTypeAssigned).reduce(
      (sum, val) => sum + val,
      0
    );
    const availableCount = Object.values(byTypeAvailable).reduce(
      (sum, val) => sum + val,
      0
    );

    let response;
    if (tab === "total") {
      response = {
        total: totalCount,
        byType: byTypeTotal,
      };
    } else if (tab === "assigned") {
      response = {
        assigned: assignedCount,
        byType: byTypeAssigned,
      };
    } else {
      response = {
        available: availableCount,
        byType: byTypeAvailable,
      };
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error getting dashboard data:", error);
    return NextResponse.json(
      { error: "Could not get dashboard data" },
      { status: 500 }
    );
  }
}
