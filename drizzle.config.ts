import { defineConfig } from "drizzle-kit";
import path from "path";
import os from "os";

const userDataDirName = "cm-online-reminder";
const homeDir = os.homedir();
let databasePath;

switch (os.platform()) {
  case "darwin":
    databasePath = path.join(
      homeDir,
      "Library",
      "Application Support",
      userDataDirName,
      "database.sqlite"
    );
    break;
  case "win32":
    databasePath = path.join(
      process.env.APPDATA || path.join(homeDir, "AppData", "Roaming"),
      userDataDirName,
      "database.sqlite"
    );
    break;
  case "linux":
    databasePath = path.join(homeDir, ".config", userDataDirName, "database.sqlite");
    break;
  default:
    throw new Error("Unsupported platform");
}

console.log(`[+] Database path has been set to: ${databasePath}`);

export default defineConfig({
  schema: "./src/db/schema/index.ts", // Path to your Drizzle schema
  out: "./src/db/migrations", // Directory to store generated migrations
  dialect: "sqlite",
  dbCredentials: {
    url: databasePath
  }
});
