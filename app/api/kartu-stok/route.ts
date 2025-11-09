// ==========================================
// API Route: GET /api/kartu-stok
// Fungsi: Ambil daftar kartu stok (history)
// View: view_kartu_stok_detail
// ==========================================

import { getKartuStok } from "@/app/lib/models/kartuStoks";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '100');
  const offset = parseInt(searchParams.get('offset') || '0');

  const result = await getKartuStok();

  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status }
    );
  }

  // Return data array directly (simpler for frontend)
  return NextResponse.json(result.data, { status: 200 });
}

