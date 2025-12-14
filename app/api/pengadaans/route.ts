import {
  getPengadaan,
  getPengadaanById,
  createPengadaan,
  batalkanPengadaan,
  updateStatusPengadaan
} from "@/app/lib/models/pengadaans";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (id) {

    const result = await getPengadaanById(parseInt(id));
    return NextResponse.json(result.error || result.data, { status: result.status });
  } else {

    const result = await getPengadaan();
    return NextResponse.json(result.error || result.data, { status: result.status });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.user_iduser || !body.vendor_idvendor || !body.details) {
      return NextResponse.json(
        { error: 'Missing required fields: user_iduser, vendor_idvendor, details' },
        { status: 400 }
      );
    }

    if (body.ppn_nilai === undefined || body.ppn_nilai === null) {
      return NextResponse.json(
        { error: 'Missing required field: ppn_nilai' },
        { status: 400 }
      );
    }

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

      result = await batalkanPengadaan(idpengadaan);
    } else if (action === 'update_status') {

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