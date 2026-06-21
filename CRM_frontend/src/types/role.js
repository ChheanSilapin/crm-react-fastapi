

import { z } from "zod";


export const RoleSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    created_at: z.string(),
    updated_at: z.string()
});

export const RoleListSchema = z.object({
    items: z.array(RoleSchema),
    total: z.number(),
    limit: z.number(),
    offset: z.number()
});

export const RoleCreate = z.object({
    name: z.string(),
    description: z.string()
});

export const RoleUpdate = RoleCreate.partial();



