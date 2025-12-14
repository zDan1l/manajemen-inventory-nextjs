import { getDetailPenerimaanForRetur } from "@/app/lib/models/retur";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const idpenerimaan = parseInt(id);

  if (isNaN(idpenerimaan)) {
    return NextResponse.json(
      { status: 400, error: 'Invalid ID' },
      { status: 400 }
    );
  }

  const result = await getDetailPenerimaanForRetur(idpenerimaan);
  return NextResponse.json(
    result.error ? { status: result.status, error: result.error } : { status: result.status, data: result.data },
    { status: result.status }
  );
}