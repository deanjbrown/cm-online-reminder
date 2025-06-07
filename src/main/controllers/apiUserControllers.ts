import { IpcMainEvent } from "electron";
import { CreateAPIUserZodSchema } from "../../shared/schemas";
import {
  createExistingAPIUserService,
  deleteAPIUserService,
  exportAPIUsersService,
  fetchAPIUsersService
} from "../services/apiUserServices";

/**
 * fetchAPIUsers
 * @param event
 *
 * Fetch all API users from the database
 */
export async function fetchAPIUsersController(event: IpcMainEvent): Promise<void> {
  try {
    const apiUsers = await fetchAPIUsersService();
    event.reply("fetchAPIUsersReply", { success: true, results: apiUsers });
  } catch (error) {
    event.reply("fetchAPIUsersReply", { success: false, results: error });
  }
}

/**
 * createExistingAPIUserController
 *
 * @param event
 * @param existingAPIUser
 *
 * Create an existing API user in the database
 */
export async function createExistingAPIUserController(
  event: IpcMainEvent,
  existingAPIUser: CreateAPIUserZodSchema
): Promise<void> {
  try {
    const createdAPIUser = await createExistingAPIUserService(existingAPIUser);
    // We can reuse the IPC reply for both new and existing APIUsers
    event.reply("createExistingAPIUserReply", { success: true, results: createdAPIUser });
  } catch (error) {
    event.reply("createExistingAPIUserReply", { success: false, results: error });
  }
}

/**
 * deleteAPIUser
 * @param id
 *
 * Delete an API user from the database
 */
export async function deleteAPIUserController(event: IpcMainEvent, id: number): Promise<void> {
  try {
    await deleteAPIUserService(id);
    event.reply("deleteAPIUserReply", { success: true, results: id });
  } catch (error) {
    event.reply("deleteAPIUserReply", { success: false, results: error });
  }
}

/**
 * exportAPIUsersController
 * 
 * Export all API users to a file
 */
export async function exportAPIUsersController(event: IpcMainEvent): Promise<void> {
  try {
    const apiUsers = await fetchAPIUsersService();
    const isExportSuccessful = await exportAPIUsersService(apiUsers);
    if( isExportSuccessful) {
      event.reply("exportAPIUsersReply", { success: true });
    }
    else {
      throw new Error("Failed to export API Users.");
    }
  } catch (error) {
    event.reply("exportAPIUsersReply", { success: false, error: error });
  }
}
