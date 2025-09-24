import { getDbConnection } from "@/app/lib/services/db";
import { Role, ApiResponse, PaginatedResponse, User } from "@/app/lib/type";
import { paginationSchema, roleSchema } from "@/app/lib/utils/validation";
import { sanitizeInput } from "../utils/sanitization";
import mysql from 'mysql2/promise';

export async function getRoles({ page = 1, pageSize = 10, search = '' }): Promise<ApiResponse<PaginatedResponse<Role>>> {
  const parsed = paginationSchema.safeParse({page, pageSize, search});
    if (!parsed.success){
        const errorMessage = parsed.error.flatten().fieldErrors;
        const formattedErrors = Object.values(errorMessage).flat().join(',');
        return {
            status : 400,
            error : formattedErrors || 'Invalid pagination parameters'
        }
    }

  const db = await getDbConnection();
  try {
    const offset = (page - 1) * pageSize;
    let query = 'SELECT * FROM role';
    let countQuery = 'SELECT COUNT(*) as total FROM role';
    const params: (string | number)[] = [];

    if (search) {
      const sanitizedSearch = sanitizeInput(search);
      query += ' WHERE nama_role LIKE ?';
      countQuery += ' WHERE nama_role LIKE ?';
      params.push(`%${sanitizedSearch}%`);
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(pageSize, offset);

    const [roles] = await db.execute(query, params);
    const [countResult] = await db.execute(countQuery, params.slice(0, search ? 1 : 0));
    const total = (countResult as any)[0].total;

    return {
      status: 200,
      data: { data: roles as Role[], total, page, pageSize },
    };
  } catch (error) {
    return { status: 500, error: `Failed to fetch roles: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}

export async function getRoleById(id: number): Promise<ApiResponse<Role>> {
  if (!id) {
    return { status: 400, error: 'Missing ID' };
  }
  const db = await getDbConnection();
  try {
    const [roles] = await db.execute('SELECT * FROM role WHERE idrole = ?', [id]);
    const roleArray = roles as Role[];
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

export async function createRole(data: Omit<Role, 'idrole' | 'created_at'>): Promise<ApiResponse<{ message: string }>> {
  const parsed = roleSchema.safeParse({ nama_role: sanitizeInput(data.nama_role) });
    if (!parsed.success){
        const errorMessage = parsed.error.flatten().fieldErrors;
        const formattedErrors = Object.values(errorMessage).flat().join(',');
        return {
            status : 400,
            error : formattedErrors || 'Invalid pagination parameters'
        }
    }

  const { nama_role } = parsed.data;
  const db = await getDbConnection();
  try {
    await db.execute('INSERT INTO role (nama_role) VALUES (?)', [nama_role]);
    return { status: 201, data: { message: 'Role created' } };
  } catch (error) {
    return { status: 500, error: `Failed to create role: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}

export async function updateRole(data: Role): Promise<ApiResponse<{ message: string }>> {
  const parsed = roleSchema.safeParse({...data, nama_role: sanitizeInput(data.nama_role) });
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
    const [users] = await db.execute('SELECT COUNT(*) as count FROM users WHERE idrole = ?', [id]);
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
