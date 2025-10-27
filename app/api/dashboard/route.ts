import { getDbConnection } from "@/app/lib/services/db";
import { NextResponse } from "next/server";

export async function GET() {
  const db = await getDbConnection();
  try {
    // Query semua statistik dalam satu kali koneksi database
    const [usersResult] = await db.execute('SELECT count_user() AS total');
    const [barangsResult] = await db.execute('SELECT count_barang() AS total');
    const [vendorsResult] = await db.execute('SELECT count_vendor() AS total');
    const [marginsResult] = await db.execute('SELECT count_margin_penjualan() AS total');

    const stats = {
      totalUsers: (usersResult as any[])[0].total,
      totalBarangs: (barangsResult as any[])[0].total,
      totalVendors: (vendorsResult as any[])[0].total,
      totalMargins: (marginsResult as any[])[0].total,
    };

    return NextResponse.json(
      { 
        ...stats,
        message: 'Dashboard statistics retrieved successfully' 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { 
        error: `Failed to fetch dashboard statistics: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }, 
      { status: 500 }
    );
  } finally {
    db.release();
  }
}