import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { apiUser } from "./apiUser";

export const vehicle = sqliteTable("vehicle", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  color: text("color"),
  vin: text("vin"),
  manufacturer: text("manufacturer"),
  model: text("model"),
  year: text("year"),
  fuelTankSize: text("fuelTankSize"),
  displacement: text("diplacement"),
  notes: text("notes"),
  node: text("node").notNull(),
  nodeName: text("nodeName").notNull(),
  presence: text("presence"),
  createdAt: text("createdAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  // Foreign key reference to apiUser
  apiUserId: integer("apiUserId")
    .notNull()
    .references(() => apiUser.id, { onDelete: "cascade", onUpdate: "cascade" })
});

export const vehicleRelations = relations(vehicle, ({ one }) => ({
  apiUser: one(apiUser, {
    fields: [vehicle.apiUserId],
    references: [apiUser.id]
  })
}));
