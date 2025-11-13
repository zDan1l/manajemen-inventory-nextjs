// ==========================================
// Model: Dashboard Analytics
// ==========================================
// Fungsi: Mengambil data untuk dashboard widgets
// ==========================================

import { getDbConnection } from "@/app/lib/services/db";
import { ApiResponse } from "@/app/lib/type";

export interface RecentStockActivity {
  idkartu_stok: number;
  idbarang: number;
  nama_barang: string;
  nama_satuan: string;
  jenis_transaksi: string;
  jenis_text: string;
  masuk: number;
  keluar: number;
  current_stock: number;
  created_at: string;
}

export interface RecentTransaction {
  idpengadaan: number;
  timestamp: string;
  username: string;
  nama_vendor: string;
  status: string;
  total_nilai: number;
}

/**
 * Get recent stock activities from kartu_stok (last 10 transactions)
 * Menampilkan aktivitas terakhir yang mempengaruhi stok
 */
export async function getRecentStockActivities(): Promise<ApiResponse<RecentStockActivity[]>> {
  const db = await getDbConnection();
  try {
    const query = `
      SELECT 
        idkartu_stok,
        idbarang,
        nama_barang,
        nama_satuan,
        jenis_transaksi,
        jenis_text,
        masuk,
        keluar,
        current_stock,
        created_at
      FROM view_kartu_stok_detail
      ORDER BY created_at DESC
      LIMIT 10
    `;
    
    const [activities] = await db.execute(query);
    return {
      status: 200,
      data: activities as RecentStockActivity[],
    };
  } catch (error) {
    return { 
      status: 500, 
      error: 'Failed to fetch recent stock activities: ' + (error instanceof Error ? error.message : 'Unknown error')
    };
  } finally {
    db.release();
  }
}

/**
 * Get recent pengadaan transactions (last 5)
 */
export async function getRecentTransactions(): Promise<ApiResponse<RecentTransaction[]>> {
  const db = await getDbConnection();
  try {
    const query = `
      SELECT 
        idpengadaan,
        timestamp,
        username,
        nama_vendor,
        status,
        total_nilai
      FROM view_pengadaan
      ORDER BY timestamp DESC
      LIMIT 5
    `;
    
    const [transactions] = await db.execute(query);
    return {
      status: 200,
      data: transactions as RecentTransaction[],
    };
  } catch (error) {
    return { 
      status: 500, 
      error: 'Failed to fetch recent transactions: ' + (error instanceof Error ? error.message : 'Unknown error')
    };
  } finally {
    db.release();
  }
}
