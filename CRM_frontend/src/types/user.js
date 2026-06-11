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
export const UserListSchema = z.object({
    items: z.array(UserSchema),
    total: z.number(),
    limit: z.number(),
    offset: z.number()
})

export const UserCreateSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
    role_id: z.number("Role is required"),
})