import { z } from "zod";

export const UserSchema = z.object({
    id: z.number(),
    username: z.string(),
    status: z.string(),
    role: z.object({
        id: z.number().optional(),
        name: z.string(),
        description: z.string(),
    }),
    created_at: z.string(),
    updated_at: z.string()
})

export const UserListSchema = z.array(UserSchema);