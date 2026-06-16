import { z } from 'zod'

export const BankBase = z.object({
   bank_name: z.string(),
   logo: z.string().nullable(),
   description: z.string().nullable(),
   bank_id: z.number(),
   created_by_user_id: z.number(),
   created_at: z.string(),
   updated_at: z.string()
})
export const BankListResponse = z.object({
    message: z.string(),
    items: z.array(BankBase),
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    page: z.number().nullable(),
    pages: z.number().nullable(),
    has_next: z.boolean().nullable(),
    has_prev: z.boolean().nullable()
});

export const BankCreate = z.object({
    bank_name: z.string().min(1, 'Bank name is required'),
    description: z.string().optional(),
    logo: z.any().optional(),
})
export const BankUpdate = z.object({
    bank_name: z.string().optional(),
    description: z.string().optional(),
    logo: z.any().optional(),
})

export const BankResponse = z.object({
    message: z.string(),
    data: BankBase
})

export const BankDeleteResponse = z.object({
    message: z.string(),
})