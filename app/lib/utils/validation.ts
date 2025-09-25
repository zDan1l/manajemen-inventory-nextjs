import { z } from 'zod';

export const userSchema = z.object({
    iduser: z.number().int().optional(),
    username: z.string().min(6, 'Username terlalu pendek').max(50, 'Username terlalu panjang'),
    password: z.string().min(6, 'Password terlalu pendek').max(50, 'Password terlalu panjang'),
    idrole: z.number().int().nullable().optional(),
})

export const roleSchema = z.object({
    idrole : z.number().int().optional(),
    nama_role : z.string().min(3, 'Nama role terlalu pendek').max(100, 'Nama role terlalu panjang'),
})


export const satuanSchema = z.object({
    idsatuan : z.number().int().optional(),
    nama_satuan : z.string().max(40, 'Nama satuan terlalu panjang'),
    status : z.string().max(1),
})

export const barangSchema = z.object({
    idbarang : z.number().int().optional(),
    idsatuan : z.number().int().optional(),
    jenis : z.string().max(100, 'Jenis barang terlalu panjang'),
    nama : z.string().max(100, 'Nama barang terlalu panjang'),
    status : z.string().max(1),
    created_at : z.string().optional(),
})


export const vendorSchema = z.object({
    idvendor : z.number().int().optional(),
    nama_vendor : z.string().max(100, 'Nama vendor terlalu panjang'),
    badan_hukum : z.string().max(100, 'Badan hukum terlalu panjang'),
    status : z.string().max(1),
})


export const paginationSchema = z.object({
    page: z.number().int().min(1).default(1),
    pageSize : z.number().int().min(1).max(100).default(10),
    search : z.string().optional(),
})