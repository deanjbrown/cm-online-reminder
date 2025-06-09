import { app, shell, BrowserWindow, Notification, nativeImage } from "electron";
import { autoUpdater } from "electron-updater";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import { initializeDatabase } from "../db/migrate";
import { initializeIPCHandlers } from "./ipcHandlers";
import {
  fetchRemindersWithAPIUserService,
  fetchVehicleDataService
} from "./services/vehicleServices";
import { VehicleWithAPIUserZodSchema, VehicleZodSchema } from "../shared/schemas/vehicle";
import { APIUserZodSchema } from "../shared/schemas";
import { authenticateAPIUserService } from "./services/apiUserServices";

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.cameramatics");

  // Check for updates
  autoUpdater.checkForUpdatesAndNotify();

  // Set the icon on Mac in dev
  const icon = nativeImage.createFromPath(
    join(__dirname, "../../resources/cm-online-reminder.png")
  );
  app.dock.setIcon(icon);

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // Initialize the database
  initializeDatabase();

  // Initialize IPC handlers
  initializeIPCHandlers();

  // Create the browser window and the render process
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  clearInterval(checkVehiclePresencesInterval);
  if (process.platform !== "darwin") {
    app.quit();
  }
});

/**
 *
 * TODO => Everything from here down needs to be refactored into a service of some kind
 *
 */

// An interface for the grouped reminders
interface GroupedReminders {
  [key: string]: {
    apiUser: APIUserZodSchema;
    vehicles: VehicleZodSchema[];
  };
}

async function groupRemindersByUserId(): Promise<GroupedReminders> {
  const reminders: VehicleWithAPIUserZodSchema[] = await fetchRemindersWithAPIUserService();

  // Group the reminders by the apiUserId
  const groupedReminders = reminders.reduce((acc, curr) => {
    const { apiUserId } = curr.vehicle;

    // Ensure that we have a valid key
    if (apiUserId == null) {
      return acc; // Skip if we don't have a valid apiUserId
    }

    if (!acc[apiUserId]) {
      acc[apiUserId] = {
        apiUser: curr.apiUser,
        vehicles: []
      };
    }

    acc[apiUserId].vehicles.push(curr.vehicle);

    return acc;
  }, {});

  return groupedReminders;
}

const checkVehiclePresences = async (groupedReminders: GroupedReminders): Promise<void> => {
  for (const { apiUser, vehicles } of Object.values(groupedReminders)) {
    // Authenticate the api user
    const authenticatedAPIUser = await authenticateAPIUserService(apiUser);

    // Fetch the vehicle data from the api
    const vehicleList = await fetchVehicleDataService(authenticatedAPIUser);

    // Iterate through our reminders and check if the presence has changed
    for (const vehicle of vehicles) {
      // Find the corresponding vehicle in the API data
      const apiVehicle = vehicleList.find((v) => v.vehicle.id === vehicle.id);
      if (apiVehicle) {
        if (apiVehicle.vehicle.presence !== vehicle.presence) {
          new Notification({
            title: `${apiUser.apiUserCustomerName} - Vehicle presence changed!`,
            body: `${apiVehicle.vehicle.name} is now ${apiVehicle.vehicle.presence}`
          }).show();
        }
      }
    }
  }
};

// Check if vehicles have come online
const checkVehiclePresencesInterval = 15 * 60 * 1000; // 15 minutes

(async (): Promise<void> => {
  // Call this once when the app is ready
  const groupedReminders = await groupRemindersByUserId();
  await checkVehiclePresences(groupedReminders);

  // Set an interval to repeatedly check
  setInterval(async () => {
    const updatedGroupedReminders = await groupRemindersByUserId();
    await checkVehiclePresences(updatedGroupedReminders);
  }, checkVehiclePresencesInterval);
})();
