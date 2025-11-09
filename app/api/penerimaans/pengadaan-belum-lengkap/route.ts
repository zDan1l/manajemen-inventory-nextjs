import { getPengadaanBelumLengkap } from "@/app/lib/models/penerimaans";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await getPengadaanBelumLengkap();
  console.log(result);
  return NextResponse.json(result, { status: result.status });
}
