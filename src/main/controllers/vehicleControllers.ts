import { IpcMainEvent } from "electron";
import { CreateVehicleZodSchema } from "../../shared/schemas/vehicle";
import {
  createReminderService,
  deleteReminderService,
  fetchRemindersService,
  fetchRemindersWithAPIUserService,
  fetchVehicleDataService
} from "../services/vehicleServices";
import { APIUserZodSchema } from "../../shared/schemas";
import { authenticateAPIUserService, fetchAPIUserByIdService } from "../services/apiUserServices";

/**
 * createReminder
 * @param event
 * @param newVehicle
 * @param apiUserId
 *
 * Creates a vehicle object in the database and returns it to the render process
 */
export async function createReminderController(
  event: IpcMainEvent,
  newVehicle: CreateVehicleZodSchema,
  apiUserId: number
): Promise<void> {
  try {
    const createdVehicle = await createReminderService(newVehicle, apiUserId);
    event.reply("createReminderReply", { success: true, results: createdVehicle });
  } catch (error) {
    event.reply("createReminderReply", { success: false, results: error });
  }
}

/**
 * fetchRemindersController
 * @param event
 *
 * Fetches the reminders from the database and returns them to the render process
 */
export async function fetchRemindersController(event: IpcMainEvent): Promise<void> {
  try {
    const reminders = await fetchRemindersService();
    event.reply("fetchRemindersReply", { success: true, results: reminders });
  } catch (error) {
    event.reply("fetchRemindersReply", { success: false, results: error });
  }
}

/**
 * fetchRemindersWithAPIUserController
 * @param event
 *
 * Fetches the reminders and the associated API Users from the database
 */
export async function fetchRemindersWithAPIUserController(event: IpcMainEvent): Promise<void> {
  try {
    const remindersWithAPIUsers = await fetchRemindersWithAPIUserService();
    event.reply("fetchRemindersReply", { success: true, results: remindersWithAPIUsers });
  } catch (error) {
    console.error(`[-] vehicleControllers - Error fetching reminders with API User: ${error}`);
    event.reply("fetchRemindersReply", { success: false, results: error });
  }
}

/**
 * deleteReminder
 * @param event
 * @param id
 *
 * Delete a reminder (vehicle) from the database
 */
export async function deleteReminderController(event: IpcMainEvent, id: string): Promise<void> {
  try {
    const deletedVehicleId = await deleteReminderService(id);
    event.reply("deleteReminderReply", { success: true, results: deletedVehicleId });
  } catch (error) {
    event.reply("deleteReminderReply", { success: false, results: error });
  }
}

/**
 * fetchAPIUsersVehiclesController
 * @param event
 * @param apiUserId
 *
 * Fetches an APIUsers vehicle data from the API
 */
export async function fetchAPIUsersVehiclesController(
  event: IpcMainEvent,
  apiUserId: number
): Promise<void> {
  try {
    // Retreve the API Users' details from the database:
    const apiUserDetails: APIUserZodSchema = await fetchAPIUserByIdService(apiUserId);

    // Authenticate the api user
    const updatedAPIUserDetails = await authenticateAPIUserService(apiUserDetails);

    // Retrieve the vehicles data
    const vehicleList = await fetchVehicleDataService(updatedAPIUserDetails);

    // Return the vehicle data and the updated api user to the render process
    event.reply("fetchAPIUsersVehiclesReply", {
      success: true,
      results: { apiUserDetails: updatedAPIUserDetails, vehicleList: vehicleList }
    });
  } catch (error) {
    event.reply("fetchAPIUsersVehiclesReply", { success: false, error: error });
  }
}
