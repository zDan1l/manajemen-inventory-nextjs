export interface User {
    iduser : number;
    username : string;
    password? : string;
    idrole? : number;
    role_name? : string;
}

export interface Role {
    idrole : number;
    nama_role : string;
}

export interface Satuan {
    idsatuan : number;
    nama_satuan : string;
    status : number | string;
}

export interface Barang {
    idbarang : number;
    idsatuan? : number;
    jenis : string;
    nama : string;
    status : string;
    created_at : string | Date;
}

export interface Vendor {
    idvendor : number;
    nama_vendor : string;
    badan_hukum : string;
    status : string;
}

export interface Margin {
    idmargin_penjualan : number;
    iuser? : number;
    created_at : string | Date;
    persen : number;
    status : number;
    updated_at : string | Date;
}

export interface ApiResponse<T>{
    status: number;
    data?: T;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}