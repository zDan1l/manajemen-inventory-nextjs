import { getDbConnection } from "@/app/lib/services/db";
import { ApiResponse, Retur, DetailReturInput } from "@/app/lib/type";

export async function getRetur(): Promise<ApiResponse<Retur[]>> {
  let connection;
  try {
    connection = await getDbConnection();
    
    // Gunakan view yang sudah dibuat di database
    const [rows] = await connection.execute(`
      SELECT * FROM v_retur_lengkap
    `);

    return {
      status: 200,
      data: Array.isArray(rows) ? rows as Retur[] : [],
    };
  } catch (error) {
    console.error('getRetur error:', error);
    // Jika view belum ada atau tabel kosong, return empty array bukan error
    return {
      status: 200,
      data: [],
    };
  } finally {
    if (connection) connection.release();
  }
}

export async function getReturById(idretur: number): Promise<ApiResponse<any>> {
  let connection;
  try {
    connection = await getDbConnection();
    
    // Get retur header dari view
    const [returRows] = await connection.execute(`
      SELECT * FROM v_retur_lengkap
      WHERE idretur = ?
    `, [idretur]);

    if (!Array.isArray(returRows) || returRows.length === 0) {
      return {
        status: 404,
        error: 'Retur not found',
      };
    }

    // Get detail retur dari view
    const [detailRows] = await connection.execute(`
      SELECT * FROM v_detail_retur_lengkap
      WHERE idretur = ?
    `, [idretur]);

    return {
      status: 200,
      data: {
        ...(returRows[0] as any),
        details: Array.isArray(detailRows) ? detailRows : []
      },
    };
  } catch (error) {
    console.error('getReturById error:', error);
    return {
      status: 500,
      error: 'Failed to fetch retur detail',
    };
  } finally {
    if (connection) connection.release();
  }
}

export async function createRetur(data: {
  idpenerimaan: number;
  iduser: number;
  details: DetailReturInput[];
}): Promise<ApiResponse<{ idretur: number }>> {
  let connection;
  try {
    const { idpenerimaan, iduser, details } = data;

    // Validasi input
    if (!idpenerimaan || !iduser || !details || !Array.isArray(details)) {
      return {
        status: 400,
        error: 'Data tidak lengkap',
      };
    }

    if (details.length === 0) {
      return {
        status: 400,
        error: 'Detail retur tidak boleh kosong',
      };
    }

    connection = await getDbConnection();

    // Call stored procedure
    const detailsJson = JSON.stringify(details);
    const [result] = await connection.execute(
      'CALL sp_create_retur(?, ?, ?)',
      [idpenerimaan, iduser, detailsJson]
    ) as any;

    // Get idretur from result
    const idretur = result[0]?.[0]?.idretur;

    if (!idretur) {
      throw new Error('Gagal membuat retur');
    }

    return {
      status: 201,
      data: { idretur },
    };

  } catch (error: any) {
    console.error('createRetur error:', error);
    return {
      status: 500,
      error: error.message || 'Gagal membuat retur',
    };
  } finally {
    if (connection) connection.release();
  }
}

export async function getPenerimaanForRetur(): Promise<ApiResponse<any[]>> {
  let connection;
  try {
    connection = await getDbConnection();
    
    const [rows] = await connection.execute(`
     SELECT * FROM v_list_penerimaan_selesai`);

    return {
      status: 200,
      data: Array.isArray(rows) ? rows as any[] : [],
    };
  } catch (error) {
    console.error('getPenerimaanForRetur error:', error);
    return {
      status: 200,
      data: [],
    };
  } finally {
    if (connection) connection.release();
  }
}

export async function getDetailPenerimaanForRetur(idpenerimaan: number): Promise<ApiResponse<any[]>> {
  let connection;
  try {
    connection = await getDbConnection();
    
    const [rows] = await connection.execute(
      'CALL sp_get_penerimaan_for_retur(?)',
      [idpenerimaan]
    ) as any;

    return {
      status: 200,
      data: Array.isArray(rows[0]) ? rows[0] as any[] : [],
    };
  } catch (error) {
    console.error('getDetailPenerimaanForRetur error:', error);
    return {
      status: 200,
      data: [],
    };
  } finally {
    if (connection) connection.release();
  }
}
