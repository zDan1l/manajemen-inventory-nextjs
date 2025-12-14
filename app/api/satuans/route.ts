import { createSatuan, deleteSatuan, getSatuan, getSatuanAktif, updateSatuan } from "@/app/lib/models/satuan";
import { Satuan } from "@/app/lib/type";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get('filter');
    let result;
    if (filter == 'aktif') {
        result = await getSatuanAktif();
    } else {
        result = await getSatuan();
    }
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