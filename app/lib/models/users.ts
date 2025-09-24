import { getDbConnection } from "@/app/lib/services/db";
import { ApiResponse, PaginatedResponse, User } from "@/app/lib/type";
import { paginationSchema, userSchema } from "@/app/lib/utils/validation";
import { sanitizeInput } from "../utils/sanitization";
import bcrypt from "bcryptjs";
import { z } from "zod";
import mysql from 'mysql2/promise';


const SALT_ROUNDS = 10;


export async function getUsers(): Promise<ApiResponse<User[]>> {
  const db = await getDbConnection();
  try {
    const [users] = await db.execute(
      'SELECT u.iduser, u.username, u.idrole, r.nama_role AS role_name FROM user u JOIN role r ON u.idrole = r.idrole;',
      []
    );

    return {
      status: 200,
      data: users as User[],
    };
  } catch (error) {
    return { status: 500, error: `Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}

export async function getUserById(id:number): Promise<ApiResponse<User>>{
    if(!id){
        return {
            status : 400,
            error: 'Missid ID'
        }
    }
    const db = await getDbConnection();
    try{
        const [users] = await db.execute('SELECT u.idrole, r.nama_role as role_name, FROM user u JOIN role r ON u.idrole = r.idrole WHERE u.iduser = ?', [id]);

        const userArray = users as User[];
        if(userArray.length === 0){
            return {
                status : 404,
                error : 'User not found'
            }
        }
        return {
            status : 200,
            data : userArray[0]
        }
    }catch(error){
        return {
            status : 500,
            error : `Failed to fetch user : ${error instanceof Error ? error.message : 'Unknown error'}`
        }
    }finally{
        db.release();
    }
}


export async function createUser(data: Omit<User, 'iduser'>) : Promise<ApiResponse<{ message : string }>>{
    const parsed = userSchema.safeParse({...data, username : sanitizeInput(data.username)});

    if(!parsed.success){
        const errorMessage = parsed.error.flatten().fieldErrors;
        const formattedErrors = Object.values(errorMessage).flat().join(',');
        return {
            status : 400,
            error : formattedErrors || 'Invalid user data'
        }
    }

    const {username, password, idrole} = parsed.data;
    const db = await getDbConnection();

    try {
        const [existing] = await db.execute('SELECT * FROM user WHERE username = ?', [username]);
        if((existing as User[]).length > 0){
            return {
                status : 400,
                error : 'Username already exists'
            }
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        await db.execute('INSERT INTO user (username, password, idrole) VALUES (?, ?, ?)', [username, hashedPassword, idrole || null ]);
        return {
            status : 201,
            data : {message : 'User created successfully'}
        }
    } catch (error) {
        return {
            status : 500,
            error : `Failed to create user : ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }finally{
        db.release();
    }
}

export async function updateUser(data: User): Promise<ApiResponse<{ message : string }>>{
    const parsed = userSchema.omit({password : true}).extend({password: z.string().min(6, 'Password terlalu pendek').max(50, 'Password terlalu panjang').optional(), })
    .safeParse({...data, username : sanitizeInput(data.username)});

    if(!parsed.success || !data.iduser){
        const errorMessage = !parsed.success ? parsed.error.flatten().fieldErrors : {iduser : ['Missing ID']};

        const formattedErrors = Object.values(errorMessage).flat().join(',');

        return {
            status : 400,
            error : formattedErrors || 'Invalid user data or missing ID'
        }
    }

    const { iduser, username, password, idrole } = parsed.data;
    const db = await getDbConnection();
    try {
        // Cek username unik (kecuali untuk user yang sama)
        const [existing] = await db.execute('SELECT iduser FROM users WHERE username = ? AND iduser != ?', [username, iduser]);
        if ((existing as any).length > 0) {
        return { status: 400, error: 'Username already exists' };
        }

        if (password) {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        await db.execute('UPDATE users SET username = ?, password = ?, idrole = ? WHERE iduser = ?', [
            username,
            hashedPassword,
            idrole || null,
            iduser,
        ]);
        } else {
        await db.execute('UPDATE users SET username = ?, idrole = ? WHERE iduser = ?', [username, idrole || null, iduser]);
        }

        return { status: 200, data: { message: 'User updated' } };
    } catch (error) {
        return { status: 500, error: `Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}` };
    } finally {
        db.release();
    }
}


export async function deleteUser(id: number): Promise<ApiResponse<{ message: string }>> {
    if (!id) {
        return { status: 400, error: 'Missing ID' };
    }

    const db = await getDbConnection();
    try {
        const [result] = await db.execute('DELETE FROM users WHERE iduser = ?', [id]);
        if((result as mysql.ResultSetHeader).affectedRows === 0){
            return {
                status : 404,
                error : 'User not found'
            }
        }

        return {
            status : 200,
            data : {message : 'User deleted successfully'}
        }
    } catch (error) {
        return {
            status: 500,
            error : `Failed to delete User : ${error instanceof Error ? error.message : 'Unknown error'}`
        }
    }finally{
        db.release();
    }

}