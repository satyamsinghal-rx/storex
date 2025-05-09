CREATE TYPE "public"."accessory_type" AS ENUM('cable', 'keyboard', 'mouse', 'other');--> statement-breakpoint
CREATE TABLE "accessories_specifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"type" "accessory_type" DEFAULT 'other',
	"remark" text
);
--> statement-breakpoint
CREATE TABLE "laptop_specifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"series" text,
	"processor" text,
	"ram" text,
	"operating_system" text,
	"screen_resolution" text,
	"storage" text,
	"charger" boolean
);
--> statement-breakpoint
CREATE TABLE "mobile_specifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"os_type" text,
	"imei_1" text,
	"imei_2" text,
	"imei_3" text
);
--> statement-breakpoint
CREATE TABLE "monitor_specifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"screen_resolution" text
);
--> statement-breakpoint
CREATE TABLE "pendrive_specifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"storage" text
);
--> statement-breakpoint
CREATE TABLE "ram_specifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"capacity" text,
	"remark" text
);
--> statement-breakpoint
CREATE TABLE "sim_specifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"asset_id" uuid NOT NULL,
	"simno" text,
	"phone_no" numeric(10, 0) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accessories_specifications" ADD CONSTRAINT "accessories_specifications_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "laptop_specifications" ADD CONSTRAINT "laptop_specifications_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mobile_specifications" ADD CONSTRAINT "mobile_specifications_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitor_specifications" ADD CONSTRAINT "monitor_specifications_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pendrive_specifications" ADD CONSTRAINT "pendrive_specifications_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ram_specifications" ADD CONSTRAINT "ram_specifications_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sim_specifications" ADD CONSTRAINT "sim_specifications_asset_id_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."assets"("id") ON DELETE no action ON UPDATE no action;