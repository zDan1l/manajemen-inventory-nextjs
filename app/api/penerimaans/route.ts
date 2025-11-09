import { getPenerimaans, createPenerimaan } from "@/app/lib/models/penerimaans";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await getPenerimaans();
  return NextResponse.json(result, { status: result.status });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idpengadaan, iduser } = body;

    if (!idpengadaan) {
      return NextResponse.json(
        { status: 400, error: "Missing idpengadaan" },
        { status: 400 }
      );
    }

    const result = await createPenerimaan({
      idpengadaan,
      iduser: iduser || null,
      details: [],
    });

    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        error: `Failed to create penerimaan: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}
