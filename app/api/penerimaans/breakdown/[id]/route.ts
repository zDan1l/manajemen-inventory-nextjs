import { getDetailPenerimaanBreakdown } from "@/app/lib/models/penerimaans";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const idpengadaan = parseInt(id);

  if (!idpengadaan) {
    return NextResponse.json(
      { status: 400, error: "Invalid pengadaan ID" },
      { status: 400 }
    );
  }

  const result = await getDetailPenerimaanBreakdown(idpengadaan);
  return NextResponse.json(result, { status: result.status });
}