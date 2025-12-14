import { getDbConnection } from "@/app/lib/services/db";
import { ApiResponse, Penjualan } from "@/app/lib/type";
import mysql from 'mysql2/promise';

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
  ppn: number;
  details: {
    idbarang: number;
    jumlah: number;
  }[];
}

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

export async function createPenjualan(
  input: CreatePenjualanInput
): Promise<ApiResponse<{ idpenjualan: number; message: string }>> {
  const { idmargin_penjualan, iduser, ppn, details } = input;

  if (!idmargin_penjualan || !iduser || ppn === undefined || !details || details.length === 0) {
    return {
      status: 400,
      error: 'Missing required fields: idmargin_penjualan, iduser, ppn, or details',
    };
  }

  const db = await getDbConnection();
  try {

    const marginId = Number(idmargin_penjualan);
    const userId = Number(iduser);
    const ppnValue = Number(ppn);

    if (isNaN(marginId) || isNaN(userId) || isNaN(ppnValue)) {
      return {
        status: 400,
        error: 'Invalid numeric values in input',
      };
    }

    const sanitizedDetails = details.map(d => ({
      idbarang: Number(d.idbarang),
      jumlah: Number(d.jumlah)
    }));

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

    const [result] = await db.execute(
      `CALL sp_create_penjualan(?, ?, ?, ?, @out_id)`,
      [marginId, userId, ppnValue, detailsJson]
    );

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