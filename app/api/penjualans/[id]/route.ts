import { NextRequest, NextResponse } from "next/server";
import { getDbConnection } from "@/app/lib/services/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { status: 400, error: "ID penjualan diperlukan" },
      { status: 400 }
    );
  }

  const db = await getDbConnection();
  try {
    // Get penjualan header
    const [penjualanRows] = await db.execute(
      "SELECT * FROM view_penjualan WHERE idpenjualan = ?",
      [id]
    );

    const penjualans = penjualanRows as any[];
    if (penjualans.length === 0) {
      return NextResponse.json(
        { status: 404, error: "Penjualan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Get detail items
    const [detailRows] = await db.execute(
      "SELECT * FROM view_detail_penjualan WHERE idpenjualan = ?",
      [id]
    );

    const penjualan = penjualans[0];
    const details = detailRows as any[];

    return NextResponse.json({
      status: 200,
      data: {
        ...penjualan,
        details: details,
      },
    });
  } catch (error) {
    console.error("Error fetching penjualan detail:", error);
    return NextResponse.json(
      {
        status: 500,
        error: `Gagal mengambil detail penjualan: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  } finally {
    db.release();
  }
}
