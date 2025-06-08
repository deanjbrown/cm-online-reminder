import { VehicleZodSchema } from "../../shared/schemas/vehicle";
import { VehiclePresenceZodSchema } from "../../shared/schemas/presence";
import { APIResponse, VehicleDataResponse } from "../types/apiTypes";
import apiClient from "./apiClient";

function mergeVehicleListWithPresence(
  vehicles: VehicleZodSchema[],
  presences: VehiclePresenceZodSchema[]
): VehicleZodSchema[] {
  return vehicles.map((vehicle) => {
    const matchingPresence = presences.find((presence) => presence.vehicleId === vehicle.id);
    // If no presence data was found, return the vehicle unchanged
    return matchingPresence ? { ...vehicle, presence: matchingPresence.status } : vehicle;
  });
}

export async function apiFetchVehicleData(
  orgId: string,
  accessToken: string,
  apiKey: string
): Promise<APIResponse<VehicleDataResponse>> {
  try {
    const requestHeaders = {
      Authorization: `Bearer ${accessToken}`,
      "x-api-key": apiKey
    };

    const [vehicleResponse, presenceResponse] = await Promise.all([
      apiClient.get(`/org/${orgId}/vehicles`, { headers: requestHeaders }),
      apiClient.get(`/org/${orgId}/vehicles/presence`, { headers: requestHeaders })
    ]);

    // The API returns a status 200 even if there is an error in the response body.
    // We need to check the response data for an error message and throw an error if it exists.
    if (vehicleResponse.data.errorMessage) {
      throw new Error(vehicleResponse.data.errorMessage);
    }

    if (presenceResponse.data.errorMessage) {
      throw new Error(vehicleResponse.data.errorMessage);
    }

    const vehicles: VehicleZodSchema[] = vehicleResponse.data.Vehicles;
    const presences: VehiclePresenceZodSchema[] = presenceResponse.data.Presences;
    const vehiclesWithPresences = mergeVehicleListWithPresence(vehicles, presences);

    return { success: true, results: { Vehicles: vehiclesWithPresences } };
  } catch (error) {
    return { success: false, errorMessage: String(error) };
  }
}
