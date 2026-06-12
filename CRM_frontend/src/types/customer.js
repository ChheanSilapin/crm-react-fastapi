

import { z } from 'zod'

export const CustomerBase = z.object({
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
});

export const CustomerListResponse = z.object({
    message: z.string(),
    items: z.array(CustomerBase),
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    page: z.number(),
    pages: z.number(),
    has_next: z.boolean(),
    has_prev: z.boolean(),
});

export const CustomerCreateSchema = z.object({
    customer_id: z.string().min(1, "Customer ID is required"),
    type: z.string().min(1, "Type is required"),
    currency: z.string().min(1, "Currency is required"),
    bank_id: z.number("Bank is required"),
    credit: z.number("Credit is required").optional(),
    amount: z.number("Amount is required").optional(),
    note: z.string().optional(),
});

export const CustomerResponse = z.object({
    message: z.string(),
    data: CustomerBase,
});