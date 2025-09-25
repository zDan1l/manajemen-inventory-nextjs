
import { createBarang, deleteBarang, getBarang, updateBarang } from "@/app/lib/models/barang";
import { Barang } from "@/app/lib/type";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await getBarang();
  return NextResponse.json(result.error || result.data, { status: result.status });
}

export async function POST(request: Request){
    const body = await request.json();
    const result = await createBarang(body as Omit<Barang, 'idbarang'>);
    return NextResponse.json(result.error || result.data, {status: result.status})
}

export async function PUT(request: Request){
    const body = await request.json();
    const result = await updateBarang(body as Barang);
    return NextResponse.json(result.error || result.data, {status: result.status})
}

export async function DELETE(request: Request){
    const { idbarang } = await request.json();
    const result = await deleteBarang(idbarang);
    return NextResponse.json(result.error || result.data, {status: result.status})
}