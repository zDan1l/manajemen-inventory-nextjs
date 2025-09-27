import { getDbConnection } from "@/app/lib/services/db";
import { ApiResponse, Vendor } from "@/app/lib/type";
import { vendorSchema } from "@/app/lib/utils/validation";
import mysql from 'mysql2/promise';


export async function getVendor(): Promise<ApiResponse<Vendor[]>> {
  const db = await getDbConnection();
  try {
  const [vendors] = await db.execute(
    'SELECT * FROM vendor');

    return {
      status: 200,
      data: vendors as Vendor[],
    };
  } catch (error) {
    return { status: 500, error: `Failed to fetch vendor: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}

export async function getVendorById(id: number): Promise<ApiResponse<Vendor>> {
  if (!id) {
    return { status: 400, error: 'Missing ID' };
  }
  const db = await getDbConnection();
  try {
    const [vendors] = await db.execute('SELECT * FROM vendor WHERE idvendor = ?', [id]);
    const vendorArray = vendors as Vendor[];
    if (vendorArray.length === 0) {
      return { status: 404, error: 'Vendor not found' };
    }
    return { status: 200, data: vendorArray[0] };
  } catch (error) {
    return { status: 500, error: `Failed to fetch vendor: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}


export async function createVendor(data: Omit<Vendor, 'idvendor'>): Promise<ApiResponse<{ message: string }>> {
  const parsed = vendorSchema.safeParse({ nama_vendor: data.nama_vendor, badan_hukum : data.badan_hukum, status : data.status, });
    if (!parsed.success){
        const errorMessage = parsed.error.flatten().fieldErrors;
        const formattedErrors = Object.values(errorMessage).flat().join(',');
        return {
            status : 400,
            error : formattedErrors || 'Invalid pagination parameters'
        }
    }

  const { nama_vendor, badan_hukum, status } = parsed.data;
  const db = await getDbConnection();
  try {
    await db.execute('INSERT INTO satuan (nama_vendor, badan_hukum, status) VALUES (?, ?, ?)', [nama_vendor, badan_hukum, status]);
    return { status: 201, data: { message: 'Vendor created' } };
  } catch (error) {
    return { status: 500, error: `Failed to create Vendor: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}

export async function updateVendor(data: Vendor): Promise<ApiResponse<{ message: string }>> {
  const parsed = vendorSchema.safeParse({...data, nama_vendor: data.nama_vendor, status : data.status});
  if (!parsed.success){
        const errorMessage = parsed.error.flatten().fieldErrors;
        const formattedErrors = Object.values(errorMessage).flat().join(',');
        return {
            status : 400,
            error : formattedErrors || 'Invalid pagination parameters'
        }
    }
  const { idvendor, nama_vendor, badan_hukum, status} = parsed.data;
  const db = await getDbConnection();
  try {
    const [result] = await db.execute('UPDATE satuan SET nama_vendor = ?, badan_hukum = ? , status = ? WHERE idvendor = ?', [nama_vendor, badan_hukum , status, idvendor]);
    if ((result as mysql.ResultSetHeader).affectedRows === 0) {
      return { status: 404, error: 'Vendor not found' };
    }
    return { status: 200, data: { message: 'Vendor updated' } };
  } catch (error) {
    return { status: 500, error: `Failed to update Vendor: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}

export async function deleteVendor(id: number): Promise<ApiResponse<{ message: string }>> {
  if (!id) {
    return { status: 400, error: 'Missing ID' };
  }
  const db = await getDbConnection();
  try {
    const [vendors] = await db.execute('SELECT COUNT(*) as count FROM vendor WHERE idvendor = ?', [id]);
    if ((vendors as any)[0].count > 0) {
      return { status: 400, error: 'Tidak dapat menghapus satuan yang masih terkait dengan barang' };
    }
    const [result] = await db.execute('DELETE FROM vendor WHERE idvendor = ?', [id]);
    if ((result as mysql.ResultSetHeader).affectedRows === 0) {
      return { status: 404, error: 'Vendor Tidak ditemukan' };
    }
    return { status: 200, data: { message: 'Vendor Berhasil Dihapus' } };
  } catch (error) {
    return { status: 500, error: `Gagal menghapus Vendor: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}
