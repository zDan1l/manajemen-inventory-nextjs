import { getDbConnection } from "@/app/lib/services/db";
import { Role, ApiResponse, Satuan } from "@/app/lib/type";
import { roleSchema } from "@/app/lib/utils/validation";
import mysql from 'mysql2/promise';


export async function getRoles(): Promise<ApiResponse<Satuan[]>> {
  const db = await getDbConnection();
  try {
  const [satuans] = await db.execute(
    'SELECT * FROM satuan');

    return {
      status: 200,
      data: satuans as Satuan[],
    };
  } catch (error) {
    return { status: 500, error: `Failed to fetch roles: ${error instanceof Error ? error.message : 'Unknown error'}` };
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
    const roleArray = satuans as Satuan[];
    if (roleArray.length === 0) {
      return { status: 404, error: 'Role not found' };
    }
    return { status: 200, data: roleArray[0] };
  } catch (error) {
    return { status: 500, error: `Failed to fetch role: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}


export async function createSatuan(data: Omit<Satuan, 'idsatuan'>): Promise<ApiResponse<{ message: string }>> {
  const parsed = .safeParse({ nama_satuan: data.nama_satuan });
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
    await db.execute('INSERT INTO role (nama_satuan, status) VALUES (?, ?)', [nama_satuan, status]);
    return { status: 201, data: { message: 'Role created' } };
  } catch (error) {
    return { status: 500, error: `Failed to create role: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}

export async function updateRole(data: Role): Promise<ApiResponse<{ message: string }>> {
  const parsed = roleSchema.safeParse({...data, nama_role: data.nama_role });
  if (!parsed.success){
        const errorMessage = parsed.error.flatten().fieldErrors;
        const formattedErrors = Object.values(errorMessage).flat().join(',');
        return {
            status : 400,
            error : formattedErrors || 'Invalid pagination parameters'
        }
    }

  const { nama_role, idrole } = parsed.data;
  const db = await getDbConnection();
  try {
    const [result] = await db.execute('UPDATE role SET nama_role = ? WHERE idrole = ?', [nama_role, idrole]);
    if ((result as mysql.ResultSetHeader).affectedRows === 0) {
      return { status: 404, error: 'Role not found' };
    }
    return { status: 200, data: { message: 'Role updated' } };
  } catch (error) {
    return { status: 500, error: `Failed to update role: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}

export async function deleteRole(id: number): Promise<ApiResponse<{ message: string }>> {
  if (!id) {
    return { status: 400, error: 'Missing ID' };
  }
  const db = await getDbConnection();
  try {
    const [users] = await db.execute('SELECT COUNT(*) as count FROM user WHERE idrole = ?', [id]);
    if ((users as any)[0].count > 0) {
      return { status: 400, error: 'Cannot delete role with associated users' };
    }
    const [result] = await db.execute('DELETE FROM role WHERE idrole = ?', [id]);
    if ((result as mysql.ResultSetHeader).affectedRows === 0) {
      return { status: 404, error: 'Role not found' };
    }
    return { status: 200, data: { message: 'Role deleted' } };
  } catch (error) {
    return { status: 500, error: `Failed to delete role: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}
