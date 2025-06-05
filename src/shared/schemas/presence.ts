import { z } from "zod";

// Define coordsSchema as part of the LastLocationSchema
const coordsSchema = z.object({
  lat: z.string(),
  long: z.string()
});

// Define lastLocationSchema as part of the vehiclePresenceSchema
const lastLocationSchema = z.object({
  coords: coordsSchema,
  speed: z.number(),
  course: z.number(),
  timestamp: z.string()
});

const vehiclePresenceSchema = z.object({
  vehicleId: z.string().uuid(),
  currentSpeed: z.number(),
  lastSeen: z.string(),
  lastSeenLocalTime: z.string(),
  status: z.enum(["OFFLINE", "MOVING", "STATIONARY", "IDLING", "UNKNOWN"]),
  faults: z.number(),
  networkSignal: z.enum(["poor", "fair", "good"]),
  acc: z.number(),
  lastLocation: lastLocationSchema
});

export type VehiclePresenceZodSchema = z.infer<typeof vehiclePresenceSchema>;
