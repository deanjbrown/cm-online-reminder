import { VehicleZodSchema } from "../../shared/schemas/vehicle";

export interface APIResponse<T> {
  success: boolean;
  results?: T;
  errorMessage?: string;
}

export interface LoginResponse {
 AccessToken: string;
 ExpiresIn: number;
}

export interface VehicleDataResponse {
  Vehicles: VehicleZodSchema[];
}