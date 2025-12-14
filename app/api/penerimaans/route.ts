import { getPenerimaans, createPenerimaan } from "@/app/lib/models/penerimaans";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await getPenerimaans();
  return NextResponse.json(result, { status: result.status });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idpengadaan, iduser, details } = body;

    console.log('Received POST /api/penerimaans:', JSON.stringify(body, null, 2));

    if (!idpengadaan) {
      return NextResponse.json(
        { status: 400, error: "Missing idpengadaan" },
        { status: 400 }
      );
    }

    if (!iduser) {
      return NextResponse.json(
        { status: 400, error: "Missing iduser" },
        { status: 400 }
      );
    }

    if (!details || !Array.isArray(details) || details.length === 0) {
      return NextResponse.json(
        { status: 400, error: "Missing or empty details array" },
        { status: 400 }
      );
    }

    const result = await createPenerimaan({
      idpengadaan: Number(idpengadaan),
      iduser: Number(iduser),
      details: details,
    });

    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    console.error('Error in POST /api/penerimaans:', error);
    return NextResponse.json(
      {
        status: 500,
        error: `Failed to create penerimaan: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}