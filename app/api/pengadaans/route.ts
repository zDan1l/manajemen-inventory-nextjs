import { 
  getPengadaan, 
  getPengadaanById, 
  createPengadaan,
  batalkanPengadaan,
  updateStatusPengadaan
} from "@/app/lib/models/pengadaans";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/pengadaans
 * Get all pengadaan atau single pengadaan by ID
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  
  if (id) {
    // Get single pengadaan
    const result = await getPengadaanById(parseInt(id));
    return NextResponse.json(result.error || result.data, { status: result.status });
  } else {
    // Get all pengadaan
    const result = await getPengadaan();
    return NextResponse.json(result.error || result.data, { status: result.status });
  }
}

/**
 * POST /api/pengadaans
 * Create new pengadaan with details
 * 
 * Body format:
 * {
 *   user_iduser: number,
 *   vendor_idvendor: number,
 *   details: [
 *     { idbarang: number, jumlah: number, harga_satuan: number },
 *     ...
 *   ]
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Validasi basic structure
    if (!body.user_iduser || !body.vendor_idvendor || !body.details) {
      return NextResponse.json(
        { error: 'Missing required fields: user_iduser, vendor_idvendor, details' },
        { status: 400 }
      );
    }
    
    // Validasi ppn_nilai
    if (body.ppn_nilai === undefined || body.ppn_nilai === null) {
      return NextResponse.json(
        { error: 'Missing required field: ppn_nilai' },
        { status: 400 }
      );
    }
    
    // Call model function (yang akan call stored procedure)
    const result = await createPengadaan(body);
    
    if (result.status === 201) {
      return NextResponse.json(result.data, { status: result.status });
    } else {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
  } catch (error) {
    console.error('Error in POST /api/pengadaans:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid request body' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/pengadaans
 * Update pengadaan (untuk update status atau batalkan)
 * 
 * Body format:
 * { action: 'update_status' | 'cancel', idpengadaan: number }
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { action, idpengadaan } = body;
    
    if (!idpengadaan) {
      return NextResponse.json(
        { error: 'Missing idpengadaan' },
        { status: 400 }
      );
    }
    
    let result;
    
    if (action === 'cancel') {
      // Batalkan pengadaan
      result = await batalkanPengadaan(idpengadaan);
    } else if (action === 'update_status') {
      // Update status pengadaan
      result = await updateStatusPengadaan(idpengadaan);
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use: update_status or cancel' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result.error || result.data, { status: result.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}