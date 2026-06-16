import { z } from 'zod';

export const LoginRequest = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

export const LoginResponse = z.object({
    access_token: z.string(),
    token_type: z.string("Bearer"),
});
export const MeResponse = z.object({
    id: z.number(),
    username: z.string(),
    status: z.string(),
    role: z.object({
        id: z.number().optional(),
        name: z.string(),
        description: z.string(),
        parent_id: z.number().nullable().optional(),
        level: z.number().optional(),
        created_at: z.string().optional(),
        updated_at: z.string().optional(),
        permissions: z.array(
            z.object({
                id: z.number(),
                name: z.string(),
                description: z.string(),
                created_at: z.string().optional(),
                updated_at: z.string().optional(),
            })
        ).optional()
    }).optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    permissions: z.array(z.string()).optional(),
});