import { db } from "@/db";
import {
  accessoriesSpecs,
  assetAssignment,
  assets,
  assetService,
  employees,
  hardDiskSpecifications,
  laptopSpecs,
  mobileSpecs,
  monitorSpecs,
  pendriveSpecs,
  ramSpecs,
  simSpecs,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq, isNull } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { handleAssetPatch } from "./handlers/updateAsset";
import { deleteAsset } from "./handlers/deleteAsset";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const [asset] = await db
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
        ownedBy: assets.ownedBy,
        clientName: assets.clientName,
        assetPic: assets.assetPic,
        createdAt: assets.createdAt,
        updatedAt: assets.updatedAt,
        deletedAt: assets.deletedAt,
      })
      .from(assets)
      .where(eq(assets.id, params.id))
      .limit(1)
      .execute();

    if (!asset) {
      return NextResponse.json({ message: "Asset not found" }, { status: 404 });
    }

    const specQueries: Record<string, () => Promise<Record<string, unknown>[]>> = {
      laptop: () =>
        db
          .select()
          .from(laptopSpecs)
          .where(eq(laptopSpecs.assetId, params.id))
          .limit(1)
          .execute(),
      mobile: () =>
        db
          .select()
          .from(mobileSpecs)
          .where(eq(mobileSpecs.assetId, params.id))
          .limit(1)
          .execute(),
      monitor: () =>
        db
          .select({
            screenRes: monitorSpecs.screenRes,
          })
          .from(monitorSpecs)
          .where(eq(monitorSpecs.assetId, params.id)),
      pendrive: () =>
        db
          .select({
            storage: pendriveSpecs.storage,
          })
          .from(pendriveSpecs)
          .where(eq(pendriveSpecs.assetId, params.id)),
      sim: () =>
        db
          .select({
            simno: simSpecs.simno,
            phone: simSpecs.phone,
          })
          .from(simSpecs)
          .where(eq(simSpecs.assetId, params.id)),
      accessories: () =>
        db
          .select({
            type: accessoriesSpecs.type,
            remark: accessoriesSpecs.remark,
          })
          .from(accessoriesSpecs)
          .where(eq(accessoriesSpecs.assetId, params.id)),
      ram: () =>
        db
          .select({
            capacity: ramSpecs.capacity,
            remark: ramSpecs.remark,
          })
          .from(ramSpecs)
          .where(eq(ramSpecs.assetId, params.id)),
      hardisk: () =>
        db
          .select({
            storage: hardDiskSpecifications.storage,
            type: hardDiskSpecifications.type,
          })
          .from(hardDiskSpecifications)
          .where(eq(hardDiskSpecifications.assetId, params.id)),
    };

    let specifications = null;
    const query = specQueries[asset.type];
    if (query) {
      [specifications] = await query();
    }

    const assignmentHistory = await db
      .select({
        assignmentId: assetAssignment.id,
        employeeId: employees.id,
        employeeName: employees.name,
        assignedOn: assetAssignment.assignedOn,
        returnedOn: assetAssignment.returnedOn,
        returnReason: assetAssignment.returnReason,
        createdAt: assetAssignment.createdAt,
      })
      .from(assetAssignment)
      .innerJoin(employees, eq(assetAssignment.employeeId, employees.id))
      .where(
        and(eq(assetAssignment.assetId, params.id), isNull(employees.deletedAt))
      );

    const serviceHistory = await db
      .select({
        serviceId: assetService.id,
        sentBy: assetService.sentBy,
        serviceReason: assetService.serviceReason,
        sentOn: assetService.sentOn,
        receivedOn: assetService.receivedOn,
        servicePrice: assetService.servicePrice,
        remark: assetService.remark,
        createdAt: assetService.createdAt,
      })
      .from(assetService)
      .where(
        and(eq(assetService.assetId, params.id), isNull(assetService.deletedAt))
      );

    const timeline = [
      ...assignmentHistory.flatMap((assignment) => {
        const events = [
          {
            type: "assignment",
            eventId: assignment.assignmentId,
            employeeId: assignment.employeeId,
            employeeName: assignment.employeeName,
            details: {
              assignedOn: assignment.assignedOn,
              returnedOn: assignment.returnedOn,
              returnReason: assignment.returnReason,
            },
            timestamp: assignment.assignedOn,
          },
        ];
        if (assignment.returnedOn) {
          events.push({
            type: "return",
            eventId: assignment.assignmentId,
            employeeId: assignment.employeeId,
            employeeName: assignment.employeeName,
            details: {
              assignedOn: assignment.assignedOn,
              returnedOn: assignment.returnedOn,
              returnReason: assignment.returnReason,
            },
            timestamp: assignment.returnedOn,
          });
        }
        return events;
      }),
      ...serviceHistory.flatMap((service) => {
        const events = [
          {
            type: "service_sent",
            eventId: service.serviceId,
            details: {
              sentOn: service.sentOn,
              receivedOn: service.receivedOn,
              servicePrice: service.servicePrice,
              remark: service.remark,
              serviceReason: service.serviceReason,
              sentBy: service.sentBy,
            },
            timestamp: service.sentOn,
          },
        ];
        if (service.receivedOn) {
          events.push({
            type: "service_received",
            eventId: service.serviceId,
            details: {
              sentOn: service.sentOn,
              receivedOn: service.receivedOn,
              servicePrice: service.servicePrice,
              remark: service.remark,
              serviceReason: service.serviceReason,
              sentBy: service.sentBy, 
            },
            timestamp: service.receivedOn,
          });
        }
        return events;
      }),
    ].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({
      asset,
      specifications,
      assignmentHistory,
      serviceHistory,
      timeline,
    });
  } catch (error) {
    console.error("Error fetching asset:", error);
    return NextResponse.json(
      { error: "Failed to fetch asset" },
      { status: 500 }
    );
  }
}


export async function PATCH(request: NextRequest, {params}: { params: { id: string } }) {
  return handleAssetPatch(request, { params });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return deleteAsset(request, { params });
}