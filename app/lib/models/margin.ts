import { getDbConnection } from "@/app/lib/services/db";
import {  ApiResponse, Margin } from "@/app/lib/type";
import { marginSchema } from "@/app/lib/utils/validation";
import mysql from 'mysql2/promise';


export async function getMargin(): Promise<ApiResponse<Margin[]>> {
  const db = await getDbConnection();
  try {
  const [margins] = await db.execute(
    'select * from view_margin');

    return {
      status: 200,
      data: margins as Margin[],
    };
  } catch (error) {
    return { status: 500, error: `Failed to fetch Margin: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}

export async function getMarginById(id: number): Promise<ApiResponse<Margin>> {
  if (!id) {
    return { status: 400, error: 'Missing ID' };
  }
  const db = await getDbConnection();
  try {
    const [margins] = await db.execute('SELECT * FROM margin_penjualan WHERE idmargin_penjualan = ?', [id]);
    const marginArray = margins as Margin[];
    if (marginArray.length === 0) {
      return { status: 404, error: 'Margin not found' };
    }
    return { status: 200, data: marginArray[0] };
  } catch (error) {
    return { status: 500, error: `Failed to fetch margin: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}


export async function createMargin(data: Omit<Margin, 'idmargin_penjualan'>): Promise<ApiResponse<{ message: string }>> {
  const parsed = marginSchema.safeParse({ ...data,persen : Number(data.persen), status : Number(data.status)});
    if (!parsed.success){
        const errorMessage = parsed.error.flatten().fieldErrors;
        const formattedErrors = Object.values(errorMessage).flat().join(',');
        return {
            status : 400,
            error : formattedErrors || 'Invalid pagination parameters'
        }
    }

  const { iduser, persen, status} = parsed.data;
  const db = await getDbConnection();
  try {
    await db.execute('INSERT INTO margin_penjualan (iduser, persen, status, updated_at, created_at) VALUES (?, ?, ? , now(), now())', [iduser, persen, status]);
    return { status: 201, data: { message: 'Margin Penjualan created' } };
  } catch (error) {
    return { status: 500, error: `Failed to create Margin: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}

export async function updateMargin(data: Margin): Promise<ApiResponse<{ message: string }>> {
  const parsed = marginSchema.safeParse({...data, created_at: data.created_at, persen : Number(data.persen), status : Number(data.status) ,updated_At : data.updated_at});
  if (!parsed.success){
        const errorMessage = parsed.error.flatten().fieldErrors;
        const formattedErrors = Object.values(errorMessage).flat().join(',');
        return {
            status : 400,
            error : formattedErrors || 'Invalid pagination parameters'
        }
    }
  const { idmargin_penjualan, iduser, persen,status, updated_at} = parsed.data;
  const db = await getDbConnection();
  try {
    const [result] = await db.execute('UPDATE margin_penjualan SET iduser = ?, persen = ?, status = ?, updated_at = now() WHERE idmargin_penjualan = ?', [iduser, persen, status, idmargin_penjualan]);
    if ((result as mysql.ResultSetHeader).affectedRows === 0) {
      return { status: 404, error: 'Margin not found' };
    }
    return { status: 200, data: { message: 'Margin updated' } };
  } catch (error) {
    return { status: 500, error: `Failed to update Margin: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}

export async function deleteMargin(id: number): Promise<ApiResponse<{ message: string }>> {
  if (!id) {
    return { status: 400, error: 'Missing ID' };
  }
  const db = await getDbConnection();
  try {
    const [penjualans] = await db.execute('SELECT COUNT(*) as count FROM penjualan WHERE idmargin_penjualan = ?', [id]);
    if ((penjualans as any)[0].count > 0) {
      return { status: 400, error: 'Tidak dapat menghapus margin yang masih terkait dengan penjualan' };
    }
    const [result] = await db.execute('DELETE FROM margin_penjualan WHERE idmargin_penjualan = ?', [id]);
    if ((result as mysql.ResultSetHeader).affectedRows === 0) {
      return { status: 404, error: 'Margin Tidak ditemukan' };
    }
    return { status: 200, data: { message: 'Margin Berhasil Dihapus' } };
  } catch (error) {
    return { status: 500, error: `Gagal menghapus Margin: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}
