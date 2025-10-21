

import { getPenjualan } from '@/app/lib/models/penjualan';
import { Penjualan } from "@/app/lib/type";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await getPenjualan();
  return NextResponse.json(result.error || result.data, { status: result.status });
}

// export async function POST(request: Request){
//     const body = await request.json();
//     const result = await createMargin(body as Omit<Margin, 'idmargin_penjualan'>);
//     console.log(result);
//     return NextResponse.json(result.error || result.data, {status: result.status})
// }

// export async function PUT(request: Request){
//     const body = await request.json();
//     const result = await updateMargin(body as Margin);
//     return NextResponse.json(result.error || result.data, {status: result.status})
// }

// export async function DELETE(request: Request){
//     const { idmargin_penjualan } = await request.json();
//     const result = await deleteMargin(idmargin_penjualan);
//     return NextResponse.json(result.error || result.data, {status: result.status})
// }