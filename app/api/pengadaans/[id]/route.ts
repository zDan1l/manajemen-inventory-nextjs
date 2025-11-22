import { getPengadaanById, getDetailPengadaan } from "@/app/lib/models/pengadaans";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  if (!id) {
    return NextResponse.json(
      { status: 400, error: 'Missing ID' },
      { status: 400 }
    );
  }

  try {
    const idpengadaan = parseInt(id);
    
    if (isNaN(idpengadaan)) {
      return NextResponse.json(
        { status: 400, error: 'Invalid ID' },
        { status: 400 }
      );
    }

    // Get pengadaan header
    const pengadaanResult = await getPengadaanById(idpengadaan);
    
    if (pengadaanResult.error) {
      return NextResponse.json(
        { status: pengadaanResult.status, error: pengadaanResult.error },
        { status: pengadaanResult.status }
      );
    }

    // Get detail pengadaan
    const detailResult = await getDetailPengadaan(idpengadaan);
    
    if (detailResult.error) {
      return NextResponse.json(
        { status: detailResult.status, error: detailResult.error },
        { status: detailResult.status }
      );
    }

    // Combine header and details
    const response = {
      ...pengadaanResult.data,
      details: detailResult.data || []
    };

    return NextResponse.json(
      { status: 200, data: response },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 500, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
