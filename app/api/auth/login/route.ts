// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDbConnection } from '@/app/lib/services/db';

interface LoginRequest {
  username: string;
  password: string;
}

interface UserData {
  iduser: number;
  username: string;
  idrole: number;
  nama_role: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { username, password } = body;

    // Validasi input
    if (!username || !password) {
      return NextResponse.json(
        { status: 400, error: 'Username dan password harus diisi' },
        { status: 400 }
      );
    }

    // Query user dengan role
    const query = `
      SELECT 
        u.iduser,
        u.username,
        u.password,
        u.idrole,
        r.nama_role
      FROM user u
      LEFT JOIN role r ON u.idrole = r.idrole
      WHERE u.username = ?
      LIMIT 1
    `;

    const connection = await getDbConnection();
    let result: any;
    
    try {
      [result] = await connection.execute(query, [username]);
    } finally {
      connection.release();
    }

    // Cek apakah user ditemukan
    if (!result || result.length === 0) {
      return NextResponse.json(
        { status: 401, error: 'Username atau password salah' },
        { status: 401 }
      );
    }

    const user = result[0];

    // Verifikasi password (plain text comparison - untuk development)
    // CATATAN: Di production, gunakan bcrypt untuk hash password!
    if (user.password !== password) {
      return NextResponse.json(
        { status: 401, error: 'Username atau password salah' },
        { status: 401 }
      );
    }

    // Hapus password dari response
    const userData: UserData = {
      iduser: user.iduser,
      username: user.username,
      idrole: user.idrole,
      nama_role: user.nama_role,
    };

    // Return success dengan user data (tanpa password)
    return NextResponse.json(
      {
        status: 200,
        data: userData,
        message: 'Login berhasil',
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { status: 500, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
