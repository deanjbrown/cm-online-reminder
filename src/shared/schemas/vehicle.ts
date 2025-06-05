import { z } from "zod";
import { apiUserSchema } from "./apiUser";

// Define the vehicle schema
export const vehicleSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: z.string(),
  color: z.string().optional().nullable(),
  vin: z.string().optional().nullable(),
  manufacturer: z.string().optional().nullable(),
  model: z.preprocess((val) => {
    if (Array.isArray(val)) return val[0];
    if (typeof val === "string") return val;
    return val;
  }, z.string().optional().nullable()),
  year: z.preprocess(
    (val) => (typeof val === "number" ? String(val) : val),
    z.string().optional().nullable()
  ),
  fuelTankSize: z.preprocess(
    (val) => (typeof val === "number" ? String(val) : val),
    z.string().optional().nullable()
  ),
  displacement: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  node: z.string(),
  nodeName: z.string(),
  presence: z.string().optional().nullable(),
  apiUserId: z.number().int().positive().optional().nullable(),
  createdAt: z.string().optional().nullable()
});

// Define a vehicle create schema as we won't have a "createdAt" when we read from the API but
// we will if we read from the database
export const createVehicleSchema = vehicleSchema.omit({
  createdAt: true
});

export const vehicleWithAPIUserSchema = z.object({
  vehicle: vehicleSchema,
  apiUser: apiUserSchema.optional()
});

export type VehicleZodSchema = z.infer<typeof vehicleSchema>;
export type CreateVehicleZodSchema = z.infer<typeof createVehicleSchema>;
export type VehicleWithAPIUserZodSchema = z.infer<typeof vehicleWithAPIUserSchema>;
