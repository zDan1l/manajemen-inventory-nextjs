// ==========================================
// Model: Penerimaan (Receiving)
// ==========================================
// Fungsi: Handle semua operasi penerimaan barang
// Database: Calls stored procedures + views
// ==========================================

import { getDbConnection } from "@/app/lib/services/db";
import { ApiResponse, Penerimaan, DetailPenerimaan } from "@/app/lib/type";
import mysql from "mysql2/promise";

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface DetailPenerimaanInput {
  idbarang: number;
  jumlah_terima: number;
  harga_satuan_terima: number;
}

export interface PenerimaanBreakdown {
  iddetail_pengadaan: number;
  idpengadaan: number;
  idbarang: number;
  nama_barang: string;
  nama_satuan: string;
  harga_satuan: number;
  jumlah_dipesan: number;
  jumlah_sudah_diterima: number;
  sisa_diterima: number;
  status_penerimaan: string;
  sub_total: number;
}

// ========================================
// GET OPERATIONS (Read from Views & DB)
// ========================================

/**
 * Get daftar pengadaan yang belum lengkap (bisa diterima)
 * View: view_pengadaan_belum_lengkap
 */
export async function getPengadaanBelumLengkap(): Promise<ApiResponse<any[]>> {
  const db = await getDbConnection();
  try {
    const [pengadaans] = await db.execute(
      "SELECT * FROM view_pengadaan_belum_lengkap"
    );
    return {
      status: 200,
      data: pengadaans as any[],
    };
  } catch (error) {
    return {
      status: 500,
      error: `Failed to fetch pengadaan: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  } finally {
    db.release();
  }
}

/**
 * Get breakdown detail pengadaan (untuk display saat input penerimaan)
 * View: view_detail_penerimaan_breakdown
 * Filter: hanya barang yang sisa_diterima > 0
 */
export async function getDetailPenerimaanBreakdown(
  idpengadaan: number
): Promise<ApiResponse<PenerimaanBreakdown[]>> {
  if (!idpengadaan) {
    return { status: 400, error: "Missing pengadaan ID" };
  }

  const db = await getDbConnection();
  try {
    const [details] = await db.execute(
      `SELECT * FROM view_detail_penerimaan_breakdown 
       WHERE idpengadaan = ? 
       AND sisa_diterima > 0`,
      [idpengadaan]
    );
    return {
      status: 200,
      data: details as PenerimaanBreakdown[],
    };
  } catch (error) {
    return {
      status: 500,
      error: `Failed to fetch breakdown: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  } finally {
    db.release();
  }
}

/**
 * Get semua penerimaan
 */
export async function getPenerimaans(): Promise<ApiResponse<Penerimaan[]>> {
  const db = await getDbConnection();
  try {
    const [penerimaans] = await db.execute(`SELECT * from view_penerimaan`);
    return {
      status: 200,
      data: penerimaans as Penerimaan[],
    };
  } catch (error) {
    return {
      status: 500,
      error: `Failed to fetch penerimaans: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  } finally {
    db.release();
  }
}

/**
 * Get penerimaan by ID
 */
export async function getPenerimaanById(
  idpenerimaan: number
): Promise<ApiResponse<Penerimaan>> {
  if (!idpenerimaan) {
    return { status: 400, error: "Missing penerimaan ID" };
  }

  const db = await getDbConnection();
  try {
    const [penerimaans] = await db.execute(
      `SELECT * FROM view_penerimaan WHERE idpenerimaan = ?`,
      [idpenerimaan]
    );

    const penerima = (penerimaans as any[])[0];
    if (!penerima) {
      return { status: 404, error: "Penerimaan not found" };
    }

    return { status: 200, data: penerima };
  } catch (error) {
    return {
      status: 500,
      error: `Failed to fetch penerimaan: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  } finally {
    db.release();
  }
}

/**
 * Get detail penerimaan by penerimaan ID
 */
export async function getDetailPenerimaan(
  idpenerimaan: number
): Promise<ApiResponse<DetailPenerimaan[]>> {
  if (!idpenerimaan) {
    return { status: 400, error: "Missing penerimaan ID" };
  }

  const db = await getDbConnection();
  try {
    const [details] = await db.execute(
      `SELECT * FROM view_detail_penerimaan WHERE idpenerimaan = ?`,
      [idpenerimaan]
    );

    return { status: 200, data: details as DetailPenerimaan[] };
  } catch (error) {
    return {
      status: 500,
      error: `Failed to fetch detail penerimaan: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  } finally {
    db.release();
  }
}

// ========================================
// CREATE OPERATIONS (Call Stored Procedures)
// ========================================

/**
 * Create penerimaan baru dengan details
 *
 * Flow:
 * 1. CALL sp_create_penerimaan (header + loop details di SQL)
 * 2. Trigger otomatis update status pengadaan
 *
 * @param data - { idpengadaan, iduser, details: [{idbarang, jumlah_terima, harga_satuan_terima}] }
 * @returns { idpenerimaan }
 */
export async function createPenerimaan(data: {
  idpengadaan: number;
  iduser: number;
  details: DetailPenerimaanInput[];
}): Promise<ApiResponse<{ idpenerimaan: number }>> {
  // Validasi input
  if (!data.idpengadaan || !data.iduser) {
    return {
      status: 400,
      error: "Missing required fields: idpengadaan, iduser",
    };
  }

  if (!data.details || data.details.length === 0) {
    return { status: 400, error: "At least one detail item is required" };
  }

  // Validasi setiap detail
  for (const detail of data.details) {
    if (
      !detail.idbarang ||
      detail.jumlah_terima === undefined ||
      detail.jumlah_terima === null ||
      detail.harga_satuan_terima === undefined ||
      detail.harga_satuan_terima === null
    ) {
      return {
        status: 400,
        error:
          "Each detail must have: idbarang, jumlah_terima, harga_satuan_terima",
      };
    }

    if (detail.jumlah_terima <= 0) {
      return { status: 400, error: "jumlah_terima must be > 0" };
    }
  }

  const db = await getDbConnection();

  try {
    console.log("=== CREATE PENERIMAAN START ===");
    console.log("Input data:", JSON.stringify(data, null, 2));

    // Format details ke JSON
    const detailsJson = JSON.stringify(data.details);
    console.log("Details JSON:", detailsJson);
    console.log("Item count:", data.details.length);

    // Call SP dengan JSON array dan item count
    // Parameter: (idpengadaan, iduser, item_count, json_string, OUT idpenerimaan)
    try {
      const [result] = await db.execute(
        "CALL sp_create_penerimaan(?, ?, ?, ?, @new_penerimaan_id)",
        [data.idpengadaan, data.iduser, data.details.length, detailsJson]
      );

      // Get ID penerimaan yang baru dibuat
      const [idResult] = await db.execute(
        "SELECT @new_penerimaan_id as idpenerimaan"
      );
      const idpenerimaan = (idResult as any)[0].idpenerimaan;

      if (!idpenerimaan || idpenerimaan === -1) {
        console.error("❌ ID penerimaan is null/invalid");
        throw new Error("Failed to create penerimaan");
      }

      console.log("✅ PENERIMAAN CREATED SUCCESSFULLY!");
      console.log(`   ID: ${idpenerimaan}`);
      console.log(`   Items: ${data.details.length}`);

      return {
        status: 201,
        data: { idpenerimaan },
      };
    } catch (spError) {
      console.error("❌ SP Error:", spError);
      throw spError;
    }
  } catch (error) {
    console.error("❌ ERROR in createPenerimaan:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return {
      status: 500,
      error: `Failed to create penerimaan: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  } finally {
    db.release();
  }
}

/**
 * Update status penerimaan (manual if needed)
 */
export async function updateStatusPenerimaan(
  idpenerimaan: number,
  status: string
): Promise<ApiResponse<{ message: string }>> {
  if (!idpenerimaan || !status) {
    return { status: 400, error: "Missing idpenerimaan or status" };
  }

  const db = await getDbConnection();
  try {
    const [result] = await db.execute(
      "UPDATE penerimaan SET status = ? WHERE idpenerimaan = ?",
      [status, idpenerimaan]
    );

    if ((result as mysql.ResultSetHeader).affectedRows === 0) {
      return { status: 404, error: "Penerimaan not found" };
    }

    return {
      status: 200,
      data: { message: "Status updated successfully" },
    };
  } catch (error) {
    return {
      status: 500,
      error: `Failed to update status: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  } finally {
    db.release();
  }
}
