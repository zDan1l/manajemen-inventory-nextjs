import { getDbConnection } from "@/app/lib/services/db";
import { ApiResponse, Barang } from "@/app/lib/type";
import { barangSchema, satuanSchema } from "@/app/lib/utils/validation";
import mysql from 'mysql2/promise';


export async function getBarang(): Promise<ApiResponse<Barang[]>> {
  const db = await getDbConnection();
  try {
  const [barangs] = await db.execute(
    'SELECT * FROM barang');

    return {
      status: 200,
      data: barangs as Barang[],
    };
  } catch (error) {
    return { status: 500, error: `Failed to fetch barangs: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}

export async function getBarangById(id: number): Promise<ApiResponse<Barang>> {
  if (!id) {
    return { status: 400, error: 'Missing ID' };
  }
  const db = await getDbConnection();
  try {
    const [barangs] = await db.execute('SELECT * FROM barang WHERE idbarang = ?', [id]);
    const barangArray = barangs as Barang[];
    if (barangArray.length === 0) {
      return { status: 404, error: 'Barang not found' };
    }
    return { status: 200, data: barangArray[0] };
  } catch (error) {
    return { status: 500, error: `Failed to fetch barang: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}


export async function createBarang(data: Omit<Barang, 'idbarang'>): Promise<ApiResponse<{ message: string }>> {
  const parsed = barangSchema.safeParse({ jenis: data.jenis, nama : data.nama, status : data.status });
    if (!parsed.success){
        const errorMessage = parsed.error.flatten().fieldErrors;
        const formattedErrors = Object.values(errorMessage).flat().join(',');
        return {
            status : 400,
            error : formattedErrors || 'Invalid pagination parameters'
        }
    }

  const { idsatuan, jenis, nama, status } = parsed.data;
  const db = await getDbConnection();
  try {
    await db.execute('INSERT INTO barang (idsatuan, jenis, nama, status) VALUES (?, ?, ?, ?, now())', [idsatuan, jenis, nama, status]);
    return { status: 201, data: { message: 'Barang created' } };
  } catch (error) {
    return { status: 500, error: `Failed to create Barang: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}

export async function updateBarang(data: Barang): Promise<ApiResponse<{ message: string }>> {
  const parsed = barangSchema.safeParse({jenis: data.jenis, nama : data.nama, status : data.status});
  if (!parsed.success){
        const errorMessage = parsed.error.flatten().fieldErrors;
        const formattedErrors = Object.values(errorMessage).flat().join(',');
        return {
            status : 400,
            error : formattedErrors || 'Invalid pagination parameters'
        }
    }
  const { idbarang, idsatuan, jenis, nama, status } = parsed.data;
  const db = await getDbConnection();
  try {
    const [result] = await db.execute('UPDATE barang SET idsatuan = ?, jenis = ?, nama = ?, status = ?, WHERE idbarang = ?', [idsatuan, jenis, nama, status, idbarang]);
    if ((result as mysql.ResultSetHeader).affectedRows === 0) {
      return { status: 404, error: 'Barang not found' };
    }
    return { status: 200, data: { message: 'Barang updated' } };
  } catch (error) {
    return { status: 500, error: `Failed to update Barang: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}

export async function deleteBarang(id: number): Promise<ApiResponse<{ message: string }>> {
  if (!id) {
    return { status: 400, error: 'Missing ID' };
  }
  const db = await getDbConnection();
  try {
    const [result] = await db.execute('DELETE FROM barang WHERE idbarang = ?', [id]);
    if ((result as mysql.ResultSetHeader).affectedRows === 0) {
      return { status: 404, error: 'Barang Tidak ditemukan' };
    }
    return { status: 200, data: { message: 'Barang Berhasil Dihapus' } };
  } catch (error) {
    return { status: 500, error: `Gagal menghapus Barang: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}
