import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import drizzleConfig from "../../drizzle.config";
import { db } from ".";

export function initializeDatabase(): void {
  try {
    console.log(`[+] Initializing the database`);
    migrate(db, { migrationsFolder: drizzleConfig.out || "./src/db/migrations" });
    console.log(`[+] Database initialized`);
  } catch (error) {
    console.error(`[-] Error initializing the database: ${error}`);
  }
}
