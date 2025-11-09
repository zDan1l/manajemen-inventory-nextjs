import { getDbConnection } from "@/app/lib/services/db";
import { ApiResponse, Pengadaan, DetailPengadaan } from "@/app/lib/type";
import mysql from 'mysql2/promise';

// ========================================
// GET OPERATIONS (Read from Views)
// ========================================

/**
 * Get all pengadaan (menggunakan view_pengadaan)
 * View sudah include join dengan user dan vendor
 */
export async function getPengadaan(): Promise<ApiResponse<Pengadaan[]>> {
  const db = await getDbConnection();
  try {
    const [pengadaans] = await db.execute('SELECT * FROM view_pengadaan');
    return {
      status: 200,
      data: pengadaans as Pengadaan[],
    };
  } catch (error) {
    return { 
      status: 500, 
      error: `Failed to fetch Pengadaan: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  } finally {
    db.release();
  }
}

/**
 * Get single pengadaan by ID
 */
export async function getPengadaanById(id: number): Promise<ApiResponse<Pengadaan>> {
  if (!id) {
    return { status: 400, error: 'Missing ID' };
  }
  
  const db = await getDbConnection();
  try {
    const [pengadaans] = await db.execute(
      'SELECT * FROM view_pengadaan WHERE idpengadaan = ?', 
      [id]
    );
    const pengadaanArray = pengadaans as Pengadaan[];
    
    if (pengadaanArray.length === 0) {
      return { status: 404, error: 'Pengadaan not found' };
    }
    
    return { status: 200, data: pengadaanArray[0] };
  } catch (error) {
    return { 
      status: 500, 
      error: `Failed to fetch pengadaan: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  } finally {
    db.release();
  }
}

/**
 * Get detail pengadaan by pengadaan ID
 */
export async function getDetailPengadaan(idpengadaan: number): Promise<ApiResponse<DetailPengadaan[]>> {
  if (!idpengadaan) {
    return { status: 400, error: 'Missing pengadaan ID' };
  }
  
  const db = await getDbConnection();
  try {
    const [details] = await db.execute(
      'SELECT * FROM view_detail_pengadaan WHERE idpengadaan = ?',
      [idpengadaan]
    );
    return { status: 200, data: details as DetailPengadaan[] };
  } catch (error) {
    return { 
      status: 500, 
      error: `Failed to fetch detail: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  } finally {
    db.release();
  }
}

// ========================================
// CREATE OPERATIONS (Call Stored Procedures)
// ========================================

/**
 * Create new pengadaan with details
 * 
 * Flow:
 * 1. CALL sp_tambah_pengadaan (membuat header)
 * 2. CALL sp_tambah_detail_pengadaan (memasukkan details dengan looping di SQL)
 * 
 * @param data - { user_iduser, vendor_idvendor, ppn_nilai, details }
 * @returns { idpengadaan }
 */
export async function createPengadaan(data: {
  user_iduser: number;
  vendor_idvendor: number;
  ppn_nilai: number;  // Nilai PPN dalam RUPIAH
  details: Array<{
    idbarang: number;
    jumlah: number;
    harga_satuan: number;
  }>;
}): Promise<ApiResponse<{ idpengadaan: number }>> {
  
  // Validasi input
  if (!data.user_iduser || !data.vendor_idvendor) {
    return { status: 400, error: 'Missing required fields: user_iduser, vendor_idvendor' };
  }
  
  if (data.ppn_nilai === undefined || data.ppn_nilai === null || data.ppn_nilai < 0) {
    return { status: 400, error: 'PPN nilai must be >= 0' };
  }
  
  if (!data.details || data.details.length === 0) {
    return { status: 400, error: 'At least one detail item is required' };
  }
  
  const db = await getDbConnection();
  
  try {
    console.log('=== CREATE PENGADAAN START ===');
    console.log('Input data:', JSON.stringify(data, null, 2));
    
    // ============================================
    // STEP 1: Call sp_tambah_pengadaan (header only)
    // ============================================
    console.log('Step 1: Calling sp_tambah_pengadaan (create header)...');
    
    const [headerResult] = await db.execute(
      'CALL sp_tambah_pengadaan(?, ?, ?, @new_pengadaan_id)',
      [data.user_iduser, data.vendor_idvendor, data.ppn_nilai]
    );
    
    // Get ID pengadaan yang baru dibuat
    const [idResult] = await db.execute('SELECT @new_pengadaan_id as idpengadaan');
    const idpengadaan = (idResult as any)[0].idpengadaan;
    
    if (!idpengadaan) {
      console.error('❌ ID pengadaan is null/undefined');
      throw new Error('Failed to create pengadaan header');
    }
    
    console.log('✅ Step 1 Success: Pengadaan header created with ID:', idpengadaan);
    
    // ============================================
    // STEP 2: Call sp_tambah_detail_pengadaan dengan JSON (looping di SQL)
    // ============================================
    console.log(`Step 2: Calling sp_tambah_detail_pengadaan with ${data.details.length} items...`);
    
    // Format details array ke JSON string
    const detailsJson = JSON.stringify(data.details);
    console.log('Details JSON:', detailsJson);
    console.log('Item count:', data.details.length);
    
    // Call SP dengan JSON array dan item count (SP akan melakukan looping)
    // Parameter: (idpengadaan, item_count, json_string)
    try {
      const [detailResult] = await db.execute(
        'CALL sp_tambah_detail_pengadaan(?, ?, ?)',
        [idpengadaan, data.details.length, detailsJson]
      );
      console.log('✅ Step 2 Success: All details added via SQL looping');
    } catch (detailError) {
      console.error('❌ Detail SP Error:', detailError);
      throw detailError;
    }
    
    console.log('✅ PENGADAAN CREATED SUCCESSFULLY!');
    console.log(`   ID: ${idpengadaan}`);
    console.log(`   Items: ${data.details.length}`);
    
    return {
      status: 201,
      data: { idpengadaan }
    };
    
  } catch (error) {
    console.error('❌ ERROR in createPengadaan:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return {
      status: 500,
      error: `Failed to create pengadaan: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  } finally {
    db.release();
  }
}

// ========================================
// UPDATE OPERATIONS
// ========================================

/**
 * Update status pengadaan
 * Memanggil sp_update_status_pengadaan
 * 
 * Procedure ini otomatis dipanggil saat penerimaan dibuat,
 * tapi bisa juga dipanggil manual jika perlu refresh status
 */
export async function updateStatusPengadaan(idpengadaan: number): Promise<ApiResponse<{ message: string }>> {
  if (!idpengadaan) {
    return { status: 400, error: 'Missing pengadaan ID' };
  }
  
  const db = await getDbConnection();
  try {
    // Call stored procedure
    await db.execute('CALL sp_update_status_pengadaan(?)', [idpengadaan]);
    
    return {
      status: 200,
      data: { message: 'Status updated successfully' }
    };
  } catch (error) {
    return {
      status: 500,
      error: `Failed to update status: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  } finally {
    db.release();
  }
}

/**
 * Batalkan pengadaan
 * Memanggil sp_batal_pengadaan
 * Hanya bisa dibatalkan jika belum ada penerimaan
 */
export async function batalkanPengadaan(idpengadaan: number): Promise<ApiResponse<{ message: string }>> {
  if (!idpengadaan) {
    return { status: 400, error: 'Missing pengadaan ID' };
  }
  
  const db = await getDbConnection();
  try {
    // Call stored procedure
    await db.execute('CALL sp_batal_pengadaan(?)', [idpengadaan]);
    
    return {
      status: 200,
      data: { message: 'Pengadaan cancelled successfully' }
    };
  } catch (error) {
    // Error dari procedure (misal: sudah ada penerimaan)
    return {
      status: 400,
      error: error instanceof Error ? error.message : 'Cannot cancel pengadaan'
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
