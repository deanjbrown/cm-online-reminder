import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const apiUser = sqliteTable("apiUser", {
  id: integer("id").primaryKey(),
  apiUserCustomerName: text("apiUserCustomerName").notNull(),
  apiUserUsername: text("apiUserUsername").notNull(),
  apiUserPassword: text("apiUserPassword").notNull(),
  orgId: text("orgId").notNull(),
  apiKey: text("apiKey").notNull(),
  accessToken: text("accessToken"),
  accessTokenCreatedAt: text("accessTokenCreatedAt"),
  createdAt: text("createdAt")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
});
