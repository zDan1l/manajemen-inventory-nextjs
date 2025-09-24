import { z } from 'zod';

export const userSchema = z.object({
    iduser: z.number().int().optional(),
    username: z.string().min(6, 'Username terlalu pendek').max(50, 'Username terlalu panjang'),
    password: z.string().min(6, 'Password terlalu pendek').max(50, 'Password terlalu panjang'),
    idorle: z.number().int().nullable().optional(),
})

export const roleSchema = z.object({
    nama_role : z.string().min(3, 'Nama role terlalu pendek').max(100, 'Nama role terlalu panjang'),
})

export const paginationSchema = z.object({
    page: z.number().int().min(1).default(1),
    pageSize : z.number().int().min(1).max(100).default(10),
    search : z.string().optional(),
})