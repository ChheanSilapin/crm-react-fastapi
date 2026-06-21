import { z } from "zod";
export const PermissionSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
});

export const PermissionListSchema = z.array(PermissionSchema);