// ==========================================
// Model: Kartu Stok (Stock Card)
// ==========================================
// Fungsi: Handle stok tracking
// Database: view_kartu_stok_detail
// ==========================================

import { getDbConnection } from "@/app/lib/services/db";
import { ApiResponse, KartuStokDetail } from "@/app/lib/type";


export async function getKartuStok(): Promise<ApiResponse<KartuStokDetail[]>> {
  const db = await getDbConnection();
    try {
    // Menggunakan view_margin_all untuk menampilkan semua margin
    const [stok] = await db.execute(
      'SELECT * FROM view_kartu_stok_detail'
    );

    return {
      status: 200,
      data: stok as KartuStokDetail[],
    };
  } catch (error) {
    return { status: 500, error: `Failed to fetch stok: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}

