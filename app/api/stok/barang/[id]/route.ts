// ==========================================
// API Route: GET /api/stok/barang/[id]
// Fungsi: Ambil current stock & history untuk barang tertentu
// ==========================================

import { getStockBarangById, getKartuStokByBarang } from "@/app/lib/models/kartuStoks";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const idbarang = parseInt(params.id);

  if (!idbarang) {
    return Response.json(
      { error: 'Invalid barang ID' },
      { status: 400 }
    );
  }

  // Get current stock
  const stockResult = await getStockBarangById(idbarang);
  if (stockResult.error) {
    return Response.json(
      { error: stockResult.error },
      { status: stockResult.status }
    );
  }

  // Get history (limit 20)
  const historyResult = await getKartuStokByBarang(idbarang, 20);
  if (historyResult.error) {
    return Response.json(
      { error: historyResult.error },
      { status: historyResult.status }
    );
  }

  // Combine response
  return Response.json(
    {
      current_stock: stockResult.data,
      history: historyResult.data,
    },
    { status: 200 }
  );
}
