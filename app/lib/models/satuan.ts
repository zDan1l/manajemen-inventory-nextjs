import { getDbConnection } from "@/app/lib/services/db";
import { Role, ApiResponse, Satuan } from "@/app/lib/type";
import { satuanSchema } from "@/app/lib/utils/validation";
import mysql from 'mysql2/promise';


export async function getSatuan(): Promise<ApiResponse<Satuan[]>> {
  const db = await getDbConnection();
  try {
  const [satuans] = await db.execute(
    'SELECT * FROM view_satuan');

    return {
      status: 200,
      data: satuans as Satuan[],
    };
  } catch (error) {
    return { status: 500, error: `Failed to fetch satuan: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}

export async function getSatuanById(id: number): Promise<ApiResponse<Satuan>> {
  if (!id) {
    return { status: 400, error: 'Missing ID' };
  }
  const db = await getDbConnection();
  try {
    const [satuans] = await db.execute('SELECT * FROM satuan WHERE idsatuan = ?', [id]);
    const satuanArray = satuans as Satuan[];
    if (satuanArray.length === 0) {
      return { status: 404, error: 'Role not found' };
    }
    return { status: 200, data: satuanArray[0] };
  } catch (error) {
    return { status: 500, error: `Failed to fetch role: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}


export async function createSatuan(data: Omit<Satuan, 'idsatuan'>): Promise<ApiResponse<{ message: string }>> {
  const parsed = satuanSchema.safeParse({ nama_satuan: data.nama_satuan, status : Number(data.status)});
  console.log(parsed);
    if (!parsed.success){
        const errorMessage = parsed.error.flatten().fieldErrors;
        const formattedErrors = Object.values(errorMessage).flat().join(',');
        return {
            status : 400,
            error : formattedErrors || 'Invalid pagination parameters'
        }
    }

  const { nama_satuan, status } = parsed.data;
  const db = await getDbConnection();
  try {
    await db.execute('INSERT INTO satuan (nama_satuan, status) VALUES (?, ?)', [nama_satuan, status]);
    return { status: 201, data: { message: 'Role created' } };
  } catch (error) {
    return { status: 500, error: `Failed to create role: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}

export async function updateSatuan(data: Satuan): Promise<ApiResponse<{ message: string }>> {
  const parsed = satuanSchema.safeParse({...data, nama_satuan: data.nama_satuan, status : data.status});
  if (!parsed.success){
        const errorMessage = parsed.error.flatten().fieldErrors;
        const formattedErrors = Object.values(errorMessage).flat().join(',');
        return {
            status : 400,
            error : formattedErrors || 'Invalid pagination parameters'
        }
    }
  const { nama_satuan, status, idsatuan} = parsed.data;
  const db = await getDbConnection();
  try {
    const [result] = await db.execute('UPDATE satuan SET nama_satuan = ?, status = ? WHERE idsatuan = ?', [nama_satuan, status, idsatuan]);
    if ((result as mysql.ResultSetHeader).affectedRows === 0) {
      return { status: 404, error: 'Satuan not found' };
    }
    return { status: 200, data: { message: 'Satuan updated' } };
  } catch (error) {
    return { status: 500, error: `Failed to update Satuan: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}

export async function deleteSatuan(id: number): Promise<ApiResponse<{ message: string }>> {
  if (!id) {
    return { status: 400, error: 'Missing ID' };
  }
  const db = await getDbConnection();
  try {
    const [barangs] = await db.execute('SELECT COUNT(*) as count FROM barang WHERE idsatuan = ?', [id]);
    if ((barangs as any)[0].count > 0) {
      return { status: 400, error: 'Tidak dapat menghapus satuan yang masih terkait dengan barang' };
    }
    const [result] = await db.execute('DELETE FROM satuan WHERE idsatuan = ?', [id]);
    if ((result as mysql.ResultSetHeader).affectedRows === 0) {
      return { status: 404, error: 'Satuan Tidak ditemukan' };
    }
    return { status: 200, data: { message: 'Satuan Berhasil Dihapus' } };
  } catch (error) {
    return { status: 500, error: `Gagal menghapus satuan: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}
