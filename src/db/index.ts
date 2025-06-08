import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { app } from "electron";
import path from "path";

// Set the location of the database to the user data folder
const dbPath = path.join(app.getPath("userData"), "database.sqlite");

// Initialize the SQLite database
const sqlite = new Database(dbPath);

// Enable foreign key support
sqlite.pragma("foreign_keys = ON");

// Initialize the Drizzle ORM
export const db = drizzle(sqlite);

console.log(`Database initialised at: ${dbPath}`);
