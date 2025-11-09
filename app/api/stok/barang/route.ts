// ==========================================
// API Route: GET /api/stok/barang
// Fungsi: Ambil current stock per barang
// ==========================================

import { getStockBarang, getStockRendah, getStockSummary } from "@/app/lib/models/kartuStoks";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get('filter');

  if (filter === 'rendah') {
    // Get stok rendah (< 10)
    const result = await getStockRendah();
    if (result.error) {
      return Response.json({ error: result.error }, { status: result.status });
    }
    return Response.json(result.data, { status: 200 });
  }

  if (filter === 'summary') {
    // Get summary
    const result = await getStockSummary();
    if (result.error) {
      return Response.json({ error: result.error }, { status: result.status });
    }
    return Response.json(result.data, { status: 200 });
  }

  // Default: Get all stock
  const result = await getStockBarang();
  if (result.error) {
    return Response.json({ error: result.error }, { status: result.status });
  }
  return Response.json(result.data, { status: 200 });
}
