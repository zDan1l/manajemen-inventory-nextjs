// ==========================================
// API Route: GET /api/kartu-stok
// Fungsi: Ambil daftar kartu stok (history)
// ==========================================

import { getKartuStok } from "@/app/lib/models/kartuStoks";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  const result = await getKartuStok(limit, offset);

  if (result.error) {
    return Response.json(
      { error: result.error },
      { status: result.status }
    );
  }

  return Response.json(result.data, { status: 200 });
}
