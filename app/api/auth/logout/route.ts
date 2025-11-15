// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Karena menggunakan localStorage di client-side,
    // kita hanya perlu return success response
    // Client-side akan handle penghapusan data dari localStorage
    
    return NextResponse.json(
      {
        status: 200,
        message: 'Logout berhasil',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { status: 500, error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
