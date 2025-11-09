// ==========================================
// Model: Kartu Stok (Stock Card)
// ==========================================
// Fungsi: Handle stok tracking
// Database: Views untuk query stok
// ==========================================

import { getDbConnection } from "@/app/lib/services/db";
import { ApiResponse } from "@/app/lib/type";
import mysql from 'mysql2/promise';

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface KartuStokDetail {
  idkartu_stok: number;
  idtransaksi: number;
  idbarang: number;
  nama_barang: string;
  nama_satuan: string;
  jenis_transaksi: string; // M, K, R
  jenis_text: string; // Penerimaan, Penjualan, Retur
  masuk: number;
  keluar: number;
  current_stock: number;
  created_at: string | Date;
}

export interface StockBarang {
  idbarang: number;
  nama_barang: string;
  nama_satuan: string;
  harga: number;
  current_stock: number;
  status_stok: string; // RENDAH, OK
}

// ========================================
// GET OPERATIONS (Read from Views)
// ========================================

/**
 * Get semua kartu stok (history)
 * View: view_kartu_stok_detail
 * Order: Created DESC (terbaru dulu)
 */
export async function getKartuStok(
  limit?: number,
  offset?: number
): Promise<ApiResponse<KartuStokDetail[]>> {
  const db = await getDbConnection();
  try {
    let query = 'SELECT * FROM view_kartu_stok_detail';
    let params: any[] = [];

    if (limit && offset !== undefined) {
      query += ' LIMIT ? OFFSET ?';
      params = [limit, offset];
    }

    const [kartuStok] = await db.execute(query, params);

    return {
      status: 200,
      data: kartuStok as KartuStokDetail[],
    };
  } catch (error) {
    return {
      status: 500,
      error: `Failed to fetch kartu stok: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  } finally {
    db.release();
  }
}

/**
 * Get kartu stok by barang ID
 * Filter: history untuk barang tertentu
 */
export async function getKartuStokByBarang(
  idbarang: number,
  limit?: number
): Promise<ApiResponse<KartuStokDetail[]>> {
  if (!idbarang) {
    return { status: 400, error: 'Missing barang ID' };
  }

  const db = await getDbConnection();
  try {
    let query = 'SELECT * FROM view_kartu_stok_detail WHERE idbarang = ? ORDER BY created_at DESC';
    let params: any[] = [idbarang];

    if (limit) {
      query += ' LIMIT ?';
      params.push(limit);
    }

    const [kartuStok] = await db.execute(query, params);

    return {
      status: 200,
      data: kartuStok as KartuStokDetail[],
    };
  } catch (error) {
    return {
      status: 500,
      error: `Failed to fetch kartu stok: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  } finally {
    db.release();
  }
}

/**
 * Get current stock per barang
 * View: view_stock_barang
 * Menampilkan: stock terkini per barang
 */
export async function getStockBarang(): Promise<ApiResponse<StockBarang[]>> {
  const db = await getDbConnection();
  try {
    const [stocks] = await db.execute(
      'SELECT * FROM view_stock_barang ORDER BY current_stock ASC'
    );

    return {
      status: 200,
      data: stocks as StockBarang[],
    };
  } catch (error) {
    return {
      status: 500,
      error: `Failed to fetch stock: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  } finally {
    db.release();
  }
}

/**
 * Get current stock untuk barang tertentu
 */
export async function getStockBarangById(
  idbarang: number
): Promise<ApiResponse<StockBarang>> {
  if (!idbarang) {
    return { status: 400, error: 'Missing barang ID' };
  }

  const db = await getDbConnection();
  try {
    const [stocks] = await db.execute(
      'SELECT * FROM view_stock_barang WHERE idbarang = ?',
      [idbarang]
    );

    const stock = (stocks as StockBarang[])[0];
    if (!stock) {
      return { status: 404, error: 'Stock not found' };
    }

    return { status: 200, data: stock };
  } catch (error) {
    return {
      status: 500,
      error: `Failed to fetch stock: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  } finally {
    db.release();
  }
}

/**
 * Get daftar barang dengan status stok RENDAH (< 10)
 */
export async function getStockRendah(): Promise<ApiResponse<StockBarang[]>> {
  const db = await getDbConnection();
  try {
    const [stocks] = await db.execute(
      `SELECT * FROM view_stock_barang 
       WHERE status_stok = 'RENDAH' 
       ORDER BY current_stock DESC`
    );

    return {
      status: 200,
      data: stocks as StockBarang[],
    };
  } catch (error) {
    return {
      status: 500,
      error: `Failed to fetch low stock: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  } finally {
    db.release();
  }
}

/**
 * Get total stok berdasarkan jenis transaksi
 * Untuk dashboard/report
 */
export async function getStockSummary(): Promise<
  ApiResponse<{
    total_masuk: number;
    total_keluar: number;
    total_retur: number;
    net_stok: number;
  }>
> {
  const db = await getDbConnection();
  try {
    const [summary] = await db.execute(`
      SELECT
        COALESCE(SUM(CASE WHEN jenis_transaksi = 'M' THEN masuk ELSE 0 END), 0) as total_masuk,
        COALESCE(SUM(CASE WHEN jenis_transaksi = 'K' THEN keluar ELSE 0 END), 0) as total_keluar,
        COALESCE(SUM(CASE WHEN jenis_transaksi = 'R' THEN masuk ELSE 0 END), 0) as total_retur,
        COALESCE(SUM(masuk) - SUM(keluar), 0) as net_stok
      FROM kartu_stok
    `);

    const data = (summary as any[])[0];

    return {
      status: 200,
      data: {
        total_masuk: data.total_masuk || 0,
        total_keluar: data.total_keluar || 0,
        total_retur: data.total_retur || 0,
        net_stok: data.net_stok || 0,
      },
    };
  } catch (error) {
    return {
      status: 500,
      error: `Failed to fetch summary: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  } finally {
    db.release();
  }
}

/**
 * Get kartu stok untuk transaksi tertentu
 * Filter: by idtransaksi dan jenis (untuk detail penerimaan/penjualan)
 */
export async function getKartuStokByTransaksi(
  idtransaksi: number,
  jenis_transaksi: string
): Promise<ApiResponse<KartuStokDetail[]>> {
  if (!idtransaksi || !jenis_transaksi) {
    return { status: 400, error: 'Missing idtransaksi or jenis_transaksi' };
  }

  const db = await getDbConnection();
  try {
    const [kartuStok] = await db.execute(
      `SELECT * FROM view_kartu_stok_detail 
       WHERE idtransaksi = ? AND jenis_transaksi = ?
       ORDER BY created_at DESC`,
      [idtransaksi, jenis_transaksi]
    );

    return {
      status: 200,
      data: kartuStok as KartuStokDetail[],
    };
  } catch (error) {
    return {
      status: 500,
      error: `Failed to fetch kartu stok: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  } finally {
    db.release();
  }
}
