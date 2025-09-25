import { createSatuan, deleteSatuan, getSatuan, updateSatuan } from "@/app/lib/models/satuan";
import { Satuan } from "@/app/lib/type";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await getSatuan();
  return NextResponse.json(result.error || result.data, { status: result.status });
}

export async function POST(request: Request){
    const body = await request.json();
    const result = await createSatuan(body as Omit<Satuan, 'idsatuan'>);
    return NextResponse.json(result.error || result.data, {status: result.status})
}

export async function PUT(request: Request){
    const body = await request.json();
    const result = await updateSatuan(body as Satuan);
    return NextResponse.json(result.error || result.data, {status: result.status})
}

export async function DELETE(request: Request){
    const { idsatuan } = await request.json();
    const result = await deleteSatuan(idsatuan);
    return NextResponse.json(result.error || result.data, {status: result.status})
}