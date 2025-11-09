// ==========================================
// API Route: GET /api/pengadaan/belum-lengkap
// Fungsi: Ambil daftar pengadaan yang belum lengkap (bisa diterima)
// ==========================================

import { getPengadaanBelumLengkap } from "@/app/lib/models/penerimaans";

export async function GET() {
  const result = await getPengadaanBelumLengkap();
  
  if (result.error) {
    return Response.json(
      { error: result.error },
      { status: result.status }
    );
  }
  
  return Response.json(result.data, { status: 200 });
}
