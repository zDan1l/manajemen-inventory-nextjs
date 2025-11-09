// ==========================================
// API Route: GET /api/penjualans/margins
// Fungsi: Ambil daftar margin aktif untuk penjualan
// ==========================================

import { getActiveMargins } from "@/app/lib/models/penjualan";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await getActiveMargins();

  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status }
    );
  }

  return NextResponse.json(result.data, { status: 200 });
}
