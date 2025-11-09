import { getPengadaanBelumLengkap } from "@/app/lib/models/penerimaans";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await getPengadaanBelumLengkap();
  return NextResponse.json(result, { status: result.status });
}
