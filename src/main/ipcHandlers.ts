import { ipcMain, IpcMainEvent } from "electron";
import { CreateAPIUserZodSchema } from "../shared/schemas";
import { CreateVehicleZodSchema } from "../shared/schemas/vehicle";
import {
  createExistingAPIUserController,
  deleteAPIUserController,
  exportAPIUsersController,
  fetchAPIUsersController,
  importAPIUsersController
} from "./controllers/apiUserControllers";
import {
  createReminderController,
  fetchAPIUsersVehiclesController,
  fetchRemindersWithAPIUserController
} from "./controllers/vehicleControllers";
import {
  deleteReminderController,
  fetchRemindersController
} from "./controllers/vehicleControllers";

export function initializeIPCHandlers(): void {
  // IPC handle create existing api user
  ipcMain.on(
    "createExistingAPIUser",
    async (event: IpcMainEvent, existingAPIUser: CreateAPIUserZodSchema) =>
      createExistingAPIUserController(event, existingAPIUser)
  );

  // IPC handle delete api user
  ipcMain.on("deleteAPIUser", async (event: IpcMainEvent, id: number) =>
    deleteAPIUserController(event, id)
  );

  // IPC handle fetch api users
  ipcMain.on("fetchAPIUsers", async (event: IpcMainEvent) => fetchAPIUsersController(event));

  // IPC handle creating a vehicle online reminder
  ipcMain.on(
    "createReminder",
    (event: IpcMainEvent, newVehicle: CreateVehicleZodSchema, apiUserId: number) =>
      createReminderController(event, newVehicle, apiUserId)
  );

  // IPC handle fetch reminders
  ipcMain.on("fetchReminders", (event: IpcMainEvent) => fetchRemindersController(event));

  // IPC handle fetch reminder with API Users
  ipcMain.on("fetchRemindersWithAPIUsers", (event: IpcMainEvent) =>
    fetchRemindersWithAPIUserController(event)
  );

  // IPC handle delete reminder
  ipcMain.on("deleteReminder", (event: IpcMainEvent, id: string) =>
    deleteReminderController(event, id)
  );

  // IPC handle fetch api users' vehicles
  ipcMain.on("fetchAPIUsersVehicles", async (event: IpcMainEvent, apiUserId: number) =>
    fetchAPIUsersVehiclesController(event, apiUserId)
  );

  // IPC handle export API Users
  ipcMain.on("exportAPIUsers", async (event: IpcMainEvent) => exportAPIUsersController(event));

  // IPC handle import API Users
  ipcMain.on("importAPIUsers", async (event: IpcMainEvent) => importAPIUsersController(event));
}
