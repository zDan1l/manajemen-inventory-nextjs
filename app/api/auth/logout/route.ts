import { NextResponse } from 'next/server';

export async function POST() {
  try {

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