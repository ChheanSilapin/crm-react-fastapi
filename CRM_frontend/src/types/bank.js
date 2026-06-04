import { z } from 'zod'
export const BankResponse = z.object({
    message: z.string(),
    items: z.array(z.object({
        bank_name: z.string(),
        logo: z.string(),
        description: z.string(),
        bank_id: z.number(),
        created_by_user_id: z.number(),
        created_at: z.string(),
        updated_at: z.string()
    })),
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    page: z.number().nullable(),
    pages: z.number().nullable(),
    has_next: z.boolean().nullable(),
    has_prev: z.boolean().nullable()
})