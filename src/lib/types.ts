export type TimelineEvent =
  | {
      type: "assignment";
      eventId: number;
      employeeId: string;
      employeeName: string;
      details: {
        assignedOn: Date;
      };
      timestamp: Date;
    }
  | {
      type: "return";
      eventId: number;
      employeeId: string;
      employeeName: string;
      details: {
        returnedOn: Date;
        returnReason: string | null;
      };
      timestamp: Date;
    }
  | {
      type: "service_sent";
      eventId: number;
      details: {
        sentOn: Date;
        serviceReason: string;
        sentBy: string;
      };
      timestamp: Date;
    }
  | {
      type: "service_received";
      eventId: number;
      details: {
        receivedOn: Date;
        servicePrice: number | null;
        remark: string | null;
      };
      timestamp: Date;
    };

export interface Asset {
  id: string;
  brand: string;
  model: string;
  serialNo: string;
  assetType: string;
  status: "Available" | "Assigned" | "Service";
  assignedTo: string | null;
  purchaseDate: string;
  type: string;
}
