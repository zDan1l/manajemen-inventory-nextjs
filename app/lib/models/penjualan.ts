// ==========================================
// Model: Penjualan (Sales)
// ==========================================
// Fungsi: Handle penjualan (mengambil dari stok penerimaan)
// Database: Stored procedure sp_create_penjualan
// ==========================================

import { getDbConnection } from "@/app/lib/services/db";
import { ApiResponse, Penjualan } from "@/app/lib/type";
import mysql from 'mysql2/promise';

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface BarangTersedia {
  idbarang: number;
  nama_barang: string;
  nama_satuan: string;
  harga_beli: number;
  status: string;
  stok_tersedia: number;
}

export interface CreatePenjualanInput {
  idmargin_penjualan: number;
  iduser: number;
  ppn: number; // nilai PPN dalam rupiah (input manual)
  details: {
    idbarang: number;
    jumlah: number;
  }[];
}

// ========================================
// GET OPERATIONS
// ========================================

/**
 * Get semua penjualan
 * View: view_penjualan (existing)
 */
export async function getPenjualan(): Promise<ApiResponse<Penjualan[]>> {
  const db = await getDbConnection();
  try {
    const [penjualans] = await db.execute('SELECT * FROM view_penjualan');

    return {
      status: 200,
      data: penjualans as Penjualan[],
    };
  } catch (error) {
    return {
      status: 500,
      error: `Failed to fetch penjualan: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  } finally {
    db.release();
  }
}

/**
 * Get barang yang tersedia untuk dijual (stok > 0)
 * View: view_barang_tersedia
 */
export async function getBarangTersedia(): Promise<ApiResponse<BarangTersedia[]>> {
  const db = await getDbConnection();
  try {
    const [barangs] = await db.execute('SELECT * FROM view_barang_tersedia');
    console.log(barangs);
    return {
      status: 200,
      data: barangs as BarangTersedia[],
    };
  } catch (error) {
    return {
      status: 500,
      error: `Failed to fetch barang tersedia: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  } finally {
    db.release();
  }
}

/**
 * Get margin penjualan yang aktif (status = 1)
 * Table: margin_penjualan
 */
export interface Margin {
  idmargin_penjualan: number;
  persen: number;
  status: string;
}

export async function getActiveMargins(): Promise<ApiResponse<Margin[]>> {
  const db = await getDbConnection();
  try {
    const [margins] = await db.execute(
      'SELECT * from view_margin_aktif',
      []
    );
    return {
      status: 200,
      data: margins as Margin[],
    };
  } catch (error) {
    return {
      status: 500,
      error: `Failed to fetch active margins: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  } finally {
    db.release();
  }
}

// ========================================
// CREATE OPERATION
// ========================================

/**
 * Create penjualan baru
 * Stored Procedure: sp_create_penjualan
 * 
 * Flow:
 * 1. Validasi stok tersedia
 * 2. Hitung harga jual (harga beli + margin)
 * 3. Insert penjualan + detail
 * 4. Trigger akan update kartu_stok (jenis 'K')
 */
export async function createPenjualan(
  input: CreatePenjualanInput
): Promise<ApiResponse<{ idpenjualan: number; message: string }>> {
  const { idmargin_penjualan, iduser, ppn, details } = input;

  // Validasi input
  if (!idmargin_penjualan || !iduser || ppn === undefined || !details || details.length === 0) {
    return {
      status: 400,
      error: 'Missing required fields: idmargin_penjualan, iduser, ppn, or details',
    };
  }

  const db = await getDbConnection();
  try {
    // Ensure all numeric values are properly typed
    const marginId = Number(idmargin_penjualan);
    const userId = Number(iduser);
    const ppnValue = Number(ppn);
    
    // Validate numeric values
    if (isNaN(marginId) || isNaN(userId) || isNaN(ppnValue)) {
      return {
        status: 400,
        error: 'Invalid numeric values in input',
      };
    }
    
    // Convert details to JSON string, ensure all values are numeric
    const sanitizedDetails = details.map(d => ({
      idbarang: Number(d.idbarang),
      jumlah: Number(d.jumlah)
    }));
    
    // Validate sanitized details
    for (const detail of sanitizedDetails) {
      if (isNaN(detail.idbarang) || isNaN(detail.jumlah)) {
        return {
          status: 400,
          error: `Invalid detail values: idbarang=${detail.idbarang}, jumlah=${detail.jumlah}`,
        };
      }
    }
    
    const detailsJson = JSON.stringify(sanitizedDetails);
    
    console.log('Calling sp_create_penjualan with params:', {
      marginId,
      userId,
      ppnValue,
      detailsJson,
      sanitizedDetails
    });

    // Call stored procedure
    const [result] = await db.execute(
      `CALL sp_create_penjualan(?, ?, ?, ?, @out_id)`,
      [marginId, userId, ppnValue, detailsJson]
    );

    // Get output parameter
    const [rows] = await db.execute('SELECT @out_id as idpenjualan');
    const idpenjualan = (rows as any)[0].idpenjualan;

    return {
      status: 201,
      data: {
        idpenjualan,
        message: 'Penjualan created successfully',
      },
    };
  } catch (error) {
    console.error('Error in createPenjualan:', error);
    return {
      status: 500,
      error: `Failed to create penjualan: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  } finally {
    db.release();
  }
}

// export async function getMarginById(id: number): Promise<ApiResponse<Margin>> {
//   if (!id) {
//     return { status: 400, error: 'Missing ID' };
//   }
//   const db = await getDbConnection();
//   try {
//     const [margins] = await db.execute('SELECT * FROM margin_penjualan WHERE idmargin_penjualan = ?', [id]);
//     const marginArray = margins as Margin[];
//     if (marginArray.length === 0) {
//       return { status: 404, error: 'Margin not found' };
//     }
//     return { status: 200, data: marginArray[0] };
//   } catch (error) {
//     return { status: 500, error: `Failed to fetch margin: ${error instanceof Error ? error.message : 'Unknown error'}` };
//   } finally {
//     db.release();
//   }
// }


// export async function createMargin(data: Omit<Margin, 'idmargin_penjualan'>): Promise<ApiResponse<{ message: string }>> {
//   const parsed = marginSchema.safeParse({ ...data,persen : Number(data.persen), status : Number(data.status)});
//     if (!parsed.success){
//         const errorMessage = parsed.error.flatten().fieldErrors;
//         const formattedErrors = Object.values(errorMessage).flat().join(',');
//         return {
//             status : 400,
//             error : formattedErrors || 'Invalid pagination parameters'
//         }
//     }

//   const { iduser, persen, status} = parsed.data;
//   const db = await getDbConnection();
//   try {
//     await db.execute('INSERT INTO margin_penjualan (iduser, persen, status, updated_at, created_at) VALUES (?, ?, ? , now(), now())', [iduser, persen, status]);
//     return { status: 201, data: { message: 'Margin Penjualan created' } };
//   } catch (error) {
//     return { status: 500, error: `Failed to create Margin: ${error instanceof Error ? error.message : 'Unknown error'}` };
//   } finally {
//     db.release();
//   }
// }

// export async function updateMargin(data: Margin): Promise<ApiResponse<{ message: string }>> {
//   const parsed = marginSchema.safeParse({...data, created_at: data.created_at, persen : Number(data.persen), status : Number(data.status) ,updated_At : data.updated_at});
//   if (!parsed.success){
//         const errorMessage = parsed.error.flatten().fieldErrors;
//         const formattedErrors = Object.values(errorMessage).flat().join(',');
//         return {
//             status : 400,
//             error : formattedErrors || 'Invalid pagination parameters'
//         }
//     }
//   const { idmargin_penjualan, iduser, persen,status, updated_at} = parsed.data;
//   const db = await getDbConnection();
//   try {
//     const [result] = await db.execute('UPDATE margin_penjualan SET iduser = ?, persen = ?, status = ?, updated_at = now() WHERE idmargin_penjualan = ?', [iduser, persen, status, idmargin_penjualan]);
//     if ((result as mysql.ResultSetHeader).affectedRows === 0) {
//       return { status: 404, error: 'Margin not found' };
//     }
//     return { status: 200, data: { message: 'Margin updated' } };
//   } catch (error) {
//     return { status: 500, error: `Failed to update Margin: ${error instanceof Error ? error.message : 'Unknown error'}` };
//   } finally {
//     db.release();
//   }
// }

// export async function deleteMargin(id: number): Promise<ApiResponse<{ message: string }>> {
//   if (!id) {
//     return { status: 400, error: 'Missing ID' };
//   }
//   const db = await getDbConnection();
//   try {
//     const [penjualans] = await db.execute('SELECT COUNT(*) as count FROM penjualan WHERE idmargin_penjualan = ?', [id]);
//     if ((penjualans as any)[0].count > 0) {
//       return { status: 400, error: 'Tidak dapat menghapus margin yang masih terkait dengan penjualan' };
//     }
//     const [result] = await db.execute('DELETE FROM margin_penjualan WHERE idmargin_penjualan = ?', [id]);
//     if ((result as mysql.ResultSetHeader).affectedRows === 0) {
//       return { status: 404, error: 'Margin Tidak ditemukan' };
//     }
//     return { status: 200, data: { message: 'Margin Berhasil Dihapus' } };
//   } catch (error) {
//     return { status: 500, error: `Gagal menghapus Margin: ${error instanceof Error ? error.message : 'Unknown error'}` };
//   } finally {
//     db.release();
//   }
// }
