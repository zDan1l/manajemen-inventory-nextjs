// app/api/returs/penerimaan-for-retur/route.ts
import { getPenerimaanForRetur } from "@/app/lib/models/retur";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await getPenerimaanForRetur();
  return NextResponse.json(
    result.error ? { status: result.status, error: result.error } : { status: result.status, data: result.data },
    { status: result.status }
  );
}
