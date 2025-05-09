import { pgTable, uuid, text, timestamp, serial, boolean, numeric, ExtraConfigColumn, integer, pgEnum } from "drizzle-orm/pg-core";
import { ColumnBaseConfig, ColumnDataType, relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
})

export const authorizedUsers = pgTable("authorized_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});
 
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<string>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
)
 
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})
 
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
)

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
)

export const employeeStatusEnum = pgEnum("employee_status", [
  "active",
  "deleted",
  "not an employee",
])

export const employeeTypeEnum = pgEnum("employee_type", [
  "employee",
  "fresher",
  "Intern",
  "freelancer",
]);

export const employees = pgTable("employees", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phoneNo: numeric("phone_no").notNull(),
  status: employeeStatusEnum("status").default("active").notNull(),
  employeeType: employeeTypeEnum("employee_type").default("employee").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
  deletedBy: uuid("deleted_by").references(() => users.id),
  deleteReason: text("delete_reason"),
});

export const assetTypeEnum = pgEnum("asset_type", [
  "laptop",
  "monitor",
  "hardisk",
  "pendrive",
  "mobile",
  "sim",
  "ram",
  "accessories",
])

export const assetStatusEnum = pgEnum("asset_status", [
  "available",
  "assigned",
  "deleted",
  "service",
]);

export const assets = pgTable("assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  brand: text("brand"),
  model: text("model"),
  serialNo: text("serial_no"),
  type: assetTypeEnum("type").notNull(),
  status: assetStatusEnum("status").default("available").notNull(),
  purchaseDate: timestamp("purchase_date").notNull(),
  warrantyStartDate: timestamp("warranty_start_date"),
  warrantyExpiryDate: timestamp("warranty_expiry_date"),
  isAvailable: boolean("is_available").default(true).notNull(),
  ownedBy: text("owned_by"),
  clientName: text("client_name"),
  assetPic: text("asset_pic"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: uuid("created_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
  deletedBy: uuid("deleted_by").references(() => users.id),
});

export const assetAssignment = pgTable("asset_assignment", {
  id: serial("id").primaryKey(),
  assetId: uuid("asset_id").references(() => assets.id).notNull(),
  employeeId: uuid("employee_id").references(() => employees.id).notNull(),
  assignedById: uuid("assigned_by_id").references(() => users.id).notNull(),
  assignedOn: timestamp("assigned_on").notNull(),
  returnedOn: timestamp("returned_on"),
  returnReason: text("return_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const assetService = pgTable("asset_service", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id").references(() => assets.id).notNull(),
  sentBy: uuid("sent_by").references(() => users.id).notNull(),
  serviceReason: text("service_reason").notNull(),
  sentOn: timestamp("sent_on").notNull(),
  receivedOn: timestamp("received_on"),
  servicePrice: numeric("service_price"),
  remark: text("remark"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const hardDiskSpecifications = pgTable("hard_disk_specifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id").references(() => assets.id).notNull(),
  storage: text("storage").notNull(),
  type: text("type").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  employeesCreated: many(employees, { relationName: "created_by" }),
  assetsCreated: many(assets, { relationName: "created_by" }),
  assetAssignments: many(assetAssignment, { relationName: "assigned_by" }),
}));

export const laptopSpecs = pgTable("laptop_specifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id),
  series: text("series"),
  processor: text("processor"),
  ram: text("ram"),
  os: text("operating_system"),
  screenRes: text("screen_resolution"),
  storage: text("storage"),
  charger: boolean("charger"),
});

export const mobileSpecs = pgTable("mobile_specifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id),
  osType: text("os_type"),
  imei1: text("imei_1"),
  imei2: text("imei_2"),
  imei3: text("imei_3"),
});

export const monitorSpecs = pgTable("monitor_specifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id),
  screenRes: text("screen_resolution"),
});

export const pendriveSpecs = pgTable("pendrive_specifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id),
  storage: text("storage"),
});

export const simSpecs = pgTable("sim_specifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id),
  simno: text("simno"),
  phone: numeric("phone_no", { precision: 10, scale: 0 }).notNull(),
});

export const accessoryTypeEnum = pgEnum("accessory_type", [
  "cable",
  "keyboard",
  "mouse",
  "other",
]);

export const accessoriesSpecs = pgTable("accessories_specifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id),
  type: accessoryTypeEnum("type").default("other"),
  remark: text("remark"),
});

export const ramSpecs = pgTable("ram_specifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id),
  capacity: text("capacity"),
  remark: text("remark"),
});

function primaryKey(arg0: { columns: ExtraConfigColumn<ColumnBaseConfig<ColumnDataType, string>>[]; }) {
  return { columns: arg0.columns };
}
