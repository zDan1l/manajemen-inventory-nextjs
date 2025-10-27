import { getDbConnection } from "@/app/lib/services/db";
import { NextResponse } from "next/server";

export async function GET() {
  const db = await getDbConnection();
  try {
    // Query semua statistik dalam satu kali koneksi database
    const [usersResult] = await db.execute('SELECT count_user() AS total');
    const [barangsResult] = await db.execute('SELECT COUNT(*) as total FROM barang');
    const [vendorsResult] = await db.execute('SELECT COUNT(*) as total FROM vendor');
    const [marginsResult] = await db.execute('SELECT COUNT(*) as total FROM margin_penjualan');

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