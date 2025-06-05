import { eq } from "drizzle-orm";
import { db } from "../../db";
import { apiUser, vehicle } from "../../db/schema";
import {
  createVehicleSchema,
  CreateVehicleZodSchema,
  vehicleWithAPIUserSchema,
  VehicleWithAPIUserZodSchema,
  VehicleZodSchema
} from "../../shared/schemas/vehicle";
import { apiFetchVehicleData } from "../api/vehicles";
import { APIUserZodSchema } from "../../shared/schemas";

/**
 * createReminderService
 * @param newVehicle - The reminder (vehicle) to create
 * @param apiUserId - The APIUser associated with the vehicle
 * @returns - The newly created reminder (vehicle) object
 *
 * Creates a new reminder (vehicle) in the database
 */
export async function createReminderService(
  newVehicle: CreateVehicleZodSchema,
  apiUserId: number
): Promise<VehicleZodSchema> {
  try {
    const validatedData = createVehicleSchema.parse(newVehicle);

    // Check if a reminder is already set for this vehicle
    const [result] = await db.select().from(vehicle).where(eq(vehicle.id, validatedData.id));
    if (result) {
      throw new Error(`Vehicle: ${validatedData.name} already has a reminder set`);
    }

    await db.insert(vehicle).values({
      ...validatedData,
      apiUserId: apiUserId,
      fuelTankSize: validatedData.fuelTankSize?.toString(),
      year: validatedData.year?.toString()
    });
    const [createdVehicle] = await db.select().from(vehicle).where(eq(vehicle.id, newVehicle.id));
    return createdVehicle;
  } catch (error) {
    throw new Error(`Unable to create reminder:\n${error}`);
  }
}

/**
 * fetchRemindersService
 * @returns - All reminders from the database
 *
 * Fetches all reminders from the database
 */
export async function fetchRemindersService(): Promise<VehicleZodSchema[]> {
  try {
    const reminders: VehicleZodSchema[] = db.select().from(vehicle).all();
    return reminders;
  } catch (error) {
    throw new Error(`Unable to fetch reminders:\n${error}`);
  }
}

/**
 * fetchRemindersWithAPIUserService
 * @returns - All reminders with the referenced APIUser object
 *
 * Fetches all reminders with the referenced APIUser object and returns it
 */
export async function fetchRemindersWithAPIUserService(): Promise<VehicleWithAPIUserZodSchema[]> {
  try {
    const remindersWithAPIUsers = await db
      .select()
      .from(vehicle)
      .innerJoin(apiUser, eq(vehicle.apiUserId, apiUser.id));

    return remindersWithAPIUsers;
  } catch (error) {
    throw new Error(`Error retrieving reminders with API Users:\n${error}`);
  }
}

/**
 * deleteReminderService
 * @param id - Id of the reminder (vehicle) to delete
 * @returns - The Id of the vehicle that was deleted
 *
 * Deletes a reminder from the database
 */
export async function deleteReminderService(id: string): Promise<string> {
  try {
    await db.delete(vehicle).where(eq(vehicle.id, id));
    return id;
  } catch (error) {
    throw new Error(`Unable to delete reminder:\n${error}`);
  }
}

/**
 * fetchVehicleDataService
 * @param orgId
 * @param accessToken
 * @param apiKey
 * @returns
 */
export async function fetchVehicleDataService(
  apiUserDetails: APIUserZodSchema
): Promise<VehicleWithAPIUserZodSchema[]> {
  try {
    const vehicleDataResponse = await apiFetchVehicleData(
      apiUserDetails.orgId,
      apiUserDetails.accessToken!,
      apiUserDetails.apiKey
    );

    if (!vehicleDataResponse?.success || !vehicleDataResponse.results?.Vehicles) {
      throw new Error(
        `Failed to fetch vehicle list. Response: ${JSON.stringify(vehicleDataResponse, null, 2)}`
      );
    }

    const vehiclesWithAPIUser: VehicleWithAPIUserZodSchema[] =
      vehicleDataResponse.results.Vehicles.map((vehicle) => {
        return vehicleWithAPIUserSchema.parse({
          vehicle,
          apiUserDetails
        });
      });

    return vehiclesWithAPIUser;
  } catch (error) {
    throw new Error(`Error fetching vehicle data: ${(error as Error).message}`);
  }
}
