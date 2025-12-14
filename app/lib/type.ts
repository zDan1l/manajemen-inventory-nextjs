export interface DashboardStats {
  totalUsers: number;
  totalBarangs: number;
  totalVendors: number;
  totalMargins: number;
}

export interface User {
  iduser: number;
  username: string;
  password?: string;
  idrole?: number;
  role_name?: string;
}

export interface Role {
  idrole: number;
  nama_role: string;
}

export interface Satuan {
  idsatuan: number;
  nama_satuan: string;
  status: number | string;
}

export interface Barang {
  idbarang: number;
  idsatuan?: number;
  jenis: string;
  nama: string;
  status: string;
  harga: string;
  created_at: string | Date;
}

export interface Vendor {
  idvendor: number;
  nama_vendor: string;
  badan_hukum: string;
  status: string;
}

export interface Margin {
  idmargin_penjualan: number;
  iuser?: number;
  created_at: string | Date;
  persen: number;
  status: number | string;
  updated_at: string | Date;
}

export interface Pengadaan {
  idpengadaan: number;
  user_iduser: number;
  vendor_idvendor: number;
  timestamp: string | Date;
  status: "P" | "S" | "L" | "B";
  subtotal_nilai: number;
  ppn: number;
  total_nilai: number;

  username?: string;
  nama_vendor?: string;
}

export interface DetailPengadaan {
  iddetail_pengadaan: number;
  idpengadaan: number;
  idbarang: number;
  harga_satuan: number;
  jumlah: number;
  jumlah_diterima?: number;
  sub_total: number;

  nama_barang?: string;
  nama_satuan?: string;
  nama_vendor?: string;
}

export interface PengadaanDetail {
  idpengadaan: number;
  tanggal: string;
  status: string;
  username: string;
  nama_vendor: string;
  subtotal_nilai: number;
  ppn: number;
  total_nilai: number;
  details: DetailPengadaan[];
}

export interface Penerimaan {
  idpenerimaan: number;
  created_at: string | Date;
  status: "I" | "V" | "A";
  idpengadaan: number;
  iduser: number;

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

  nama_barang?: string;
  nama_satuan?: string;
  nama_vendor?: string;
  idpengadaan?: number;
  jumlah_sudah_retur?: number;
  sisa_bisa_retur?: number;
  total_nilai: number;
}

export interface PenerimaanDetail {
  idpenerimaan: number;
  created_at: string | Date;
  status: string;
  idpengadaan: number;
  iduser: number;
  username: string;
  nama_vendor: string;
  total_items: number;
  total_nilai: number;
  details: DetailPenerimaan[];
}

export interface Retur {
  idretur: number;
  created_at: string | Date;
  idpenerimaan: number;
  iduser: number;

  username?: string;
}

export interface DetailRetur {
  iddetail_retur: number;
  idretur: number;
  iddetail_penerimaan: number;
  jumlah: number;
  alasan: string;

  nama_barang?: string;
}

export interface Penjualan {
  idpenjualan: number;
  created_at: string | Date;
  subtotal_nilai: number;
  ppn: number;
  total_nilai: number;
  iduser: number;
  idmargin_penjualan: number;

  username?: string;
  margin_persen?: number;
}

export interface DetailPenjualan {
  iddetail_penjualan: number;
  idpenjualan: number;
  idbarang: number;
  harga_satuan: number;
  jumlah: number;
  subtotal: number;

  nama_barang?: string;
  nama_satuan?: string;
  tanggal_penjualan?: string | Date;
  username?: string;
  margin_persen?: number;
}

export interface PenjualanDetail {
  idpenjualan: number;
  created_at: string | Date;
  iduser: number;
  username: string;
  idmargin_penjualan: number;
  margin_persen: number;
  subtotal_nilai: number;
  ppn: number;
  total_nilai: number;
  total_items: number;
  details: DetailPenjualan[];
}

export interface BarangTersedia {
  idbarang: number;
  nama_barang: string;
  nama_satuan: string;
  harga_beli: number;
  status: string;
  stok_tersedia: number;
}

export interface DetailPenjualanInput {
  idbarang: number;
  jumlah: number;
  harga_jual: number;
  sub_total: number;
  nama_barang?: string;
  nama_satuan?: string;
  stok_tersedia?: number;
  harga_beli?: number;
}

export interface KartuStokDetail {
  idkartu_stok: number;
  idtransaksi: number;
  idbarang: number;
  nama_barang: string;
  nama_satuan: string;
  jenis_transaksi: string;
  jenis_text: string;
  masuk: number;
  keluar: number;
  current_stock: number;
  created_at: string | Date;
}

export interface Retur {
  idretur: number;
  created_at: string | Date;
  idpenerimaan: number;
  iduser: number;
  username?: string;
  idpengadaan?: number;
  nama_vendor?: string;
  total_items?: number;
  total_qty_retur?: number;
  total_nilai_retur?: number;
}

export interface DetailRetur {
  iddetail_retur: number;
  idretur: number;
  iddetail_penerimaan: number;
  jumlah: number;
  alasan: string;
  idbarang?: number;
  nama_barang?: string;
  nama_satuan?: string;
  harga_satuan?: number;
}

export interface DetailPenerimaanForRetur {
  iddetail_penerimaan: number;
  idbarang: number;
  nama: string;
  nama_satuan: string;
  jumlah_terima: number;
  harga_satuan_terima: number;
  jumlah_sudah_retur: number;
  sisa_bisa_retur: number;
  sub_total: number;
}

export interface DetailReturInput {
  iddetail_penerimaan: number;
  jumlah: number;
  alasan: string;
  nama_barang?: string;
  nama_satuan?: string;
  sisa_bisa_retur?: number;
}

export interface ApiResponse<T> {
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