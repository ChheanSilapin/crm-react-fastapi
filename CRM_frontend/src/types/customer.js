

import { z } from 'zod'
export const CustomerResponse = z.object({
    message: z.string(),
    items: z.array(
        z.object({
            id: z.number(),
            customer_id: z.string(),
            type: z.string(),
            currency: z.string(),
            credit: z.string(),
            amount: z.string(),
            note: z.string().nullable(),
            bank: z.object({
                bank_id: z.number(),
                bank_name: z.string(),
            }),
            create_at: z.string(),
            update_at: z.string(),
            created_by_user: z.object({
                id: z.number(),
                username: z.string(),
            }),
        })
    ),
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    page: z.number(),
    pages: z.number(),
    has_next: z.boolean(),
    has_prev: z.boolean(),
})