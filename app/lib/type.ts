export interface DashboardStats {
  totalUsers: number;
  totalBarangs: number;
  totalVendors: number;
  totalMargins: number;
}


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
    harga : string;
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

// ========================================
// TRANSACTION ENTITIES (with detailed fields)
// ========================================

export interface Pengadaan {
    idpengadaan: number;
    user_iduser: number;
    vendor_idvendor: number;
    timestamp: string | Date;
    status: 'P' | 'S' | 'L' | 'B'; // P=Proses, S=Sebagian, L=Lengkap, B=Batal
    subtotal_nilai: number;
    ppn: number;  // Nilai PPN dalam rupiah (dari input user)
    total_nilai: number;
    // Relations for view
    username?: string;
    nama_vendor?: string;
}

export interface DetailPengadaan {
    iddetail_pengadaan: number;
    idpengadaan: number;
    idbarang: number;
    harga_satuan: number;
    jumlah: number;
    jumlah_diterima?: number; // Updated by trigger
    sub_total: number;
    // Relations
    nama_barang?: string;
}

export interface Penerimaan {
    idpenerimaan: number;
    created_at: string | Date;
    status: 'I' | 'V' | 'A'; // I=Input, V=Verified, A=Approved
    idpengadaan: number;
    iduser: number;
    // Relations
    username?: string;
    nama_vendor?: string;
    vendor_idvendor?: number;
}

export interface DetailPenerimaan {
    iddetail_penerimaan: number;
    idpenerimaan: number;
    idbarang: number;
    jumlah_terima: number;
    harga_satuan_terima: number;
    sub_total_terima: number;
    // Relations
    nama_barang?: string;
    nama_satuan?: string;
}

export interface Retur {
    idretur: number;
    created_at: string | Date;
    idpenerimaan: number;
    iduser: number;
    // Relations
    username?: string;
}

export interface DetailRetur {
    iddetail_retur: number;
    idretur: number;
    iddetail_penerimaan: number;
    jumlah: number;
    alasan: string;
    // Relations
    nama_barang?: string;
}

export interface Penjualan {
    idpenjualan: number;
    created_at: string | Date;
    status: 'D' | 'P' | 'B' | 'S'; // D=Draft, P=Posted, B=Batal, S=Selesai
    subtotal_nilai: number;
    ppn: number;
    total_nilai: number;
    iduser: number;
    idmargin_penjualan: number;
    // Relations
    username?: string;
    margin_persen?: number;
}

export interface DetailPenjualan {
    iddetail_penjualan: number;
    idpenjualan: number;
    idbarang: number;
    harga_jual: number;
    jumlah: number;
    subtotal: number;
    // Relations
    nama_barang?: string;
}

export interface KartuStok {
    idkartu_stok: number;
    jenis_transaksi: 'M' | 'K' | 'R'; // M=Masuk, K=Keluar, R=Retur
    idtransaksi: number; // ID dari penerimaan/penjualan/retur
    masuk: number;
    keluar: number;
    stock: number;
    created_at: string | Date;
    idbarang: number;
    // Relations
    nama_barang?: string;
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


