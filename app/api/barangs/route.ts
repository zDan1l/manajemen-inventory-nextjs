import { createBarang, deleteBarang, getBarang, getBarangAktif, updateBarang } from "@/app/lib/models/barang";
import { Barang } from "@/app/lib/type";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

  const searchParams = request.nextUrl.searchParams;
  const filter = searchParams.get('filter');

  let result;

  if (filter === 'aktif') {

    result = await getBarangAktif();
  } else {

    result = await getBarang();
  }

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