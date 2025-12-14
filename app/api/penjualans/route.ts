import { getPenjualan, createPenjualan } from '@/app/lib/models/penjualan';
import { NextResponse } from "next/server";

export async function GET() {
  const result = await getPenjualan();
  return NextResponse.json(result, { status: result.status });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idmargin_penjualan, iduser, ppn, details } = body;

    console.log('Received POST /api/penjualans:', JSON.stringify(body, null, 2));

    if (!idmargin_penjualan) {
      return NextResponse.json(
        { status: 400, error: "Missing idmargin_penjualan" },
        { status: 400 }
      );
    }

    if (!iduser) {
      return NextResponse.json(
        { status: 400, error: "Missing iduser" },
        { status: 400 }
      );
    }

    if (ppn === undefined || ppn === null) {
      return NextResponse.json(
        { status: 400, error: "Missing ppn (nilai PPN dalam rupiah)" },
        { status: 400 }
      );
    }

    if (!details || !Array.isArray(details) || details.length === 0) {
      return NextResponse.json(
        { status: 400, error: "Missing or empty details array" },
        { status: 400 }
      );
    }

    for (const detail of details) {
      if (!detail.idbarang || isNaN(Number(detail.idbarang))) {
        return NextResponse.json(
          { status: 400, error: `Invalid idbarang: ${detail.idbarang}` },
          { status: 400 }
        );
      }
      if (!detail.jumlah || isNaN(Number(detail.jumlah)) || Number(detail.jumlah) <= 0) {
        return NextResponse.json(
          { status: 400, error: `Invalid jumlah: ${detail.jumlah}` },
          { status: 400 }
        );
      }
    }

    const result = await createPenjualan({
      idmargin_penjualan: Number(idmargin_penjualan),
      iduser: Number(iduser),
      ppn: Number(ppn),
      details: details.map(d => ({
        idbarang: Number(d.idbarang),
        jumlah: Number(d.jumlah)
      })),
    });

    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    console.error('Error in POST /api/penjualans:', error);
    return NextResponse.json(
      {
        status: 500,
        error: `Failed to create penjualan: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}