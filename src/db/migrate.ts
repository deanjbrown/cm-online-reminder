import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import drizzleConfig from "../../drizzle.config";
import { db } from ".";
import { app } from "electron";
import path from "path";

export function initializeDatabase(): void {
  try {
    const migrationsFolder = app.isPackaged
      ? path.join(process.resourcesPath, "migrations")
      : drizzleConfig.out || path.join(__dirname, "./src/db/migrations");

    console.log(`[+] Initializing the database`);
    migrate(db, { migrationsFolder });
    console.log(`[+] Database initialized`);
  } catch (error) {
    console.error(`[-] Error initializing the database: ${error}`);
  }
}
