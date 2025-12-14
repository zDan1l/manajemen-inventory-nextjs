import { getBarangTersedia } from "@/app/lib/models/penjualan";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await getBarangTersedia();

  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status }
    );
  }

  return NextResponse.json(result.data, { status: 200 });
}