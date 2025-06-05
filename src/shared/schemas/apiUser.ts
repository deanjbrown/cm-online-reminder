import { z } from "zod";

export const apiUserSchema = z.object({
  id: z.number().int().positive(),
  apiUserCustomerName: z.string().min(2),
  apiUserUsername: z.string().email(),
  apiUserPassword: z.string().min(8),
  orgId: z.string().uuid(),
  apiKey: z.string().min(8),
  accessToken: z.string().nullable().optional(),
  accessTokenCreatedAt: z.string().nullable().optional(),
  createdAt: z.string()
});

// Used to create an existing APIUser
export const createAPIUserSchema = apiUserSchema.omit({
  id: true,
  createdAt: true
});

export type APIUserZodSchema = z.infer<typeof apiUserSchema>;
export type CreateAPIUserZodSchema = z.infer<typeof createAPIUserSchema>;
