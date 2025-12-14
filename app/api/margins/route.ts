import { createMargin, deleteMargin, getMargin, getmarginAktif, updateMargin } from "@/app/lib/models/margin";
import { Margin } from "@/app/lib/type";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get('filter');
    let result;
    if (filter == 'aktif') {
        result = await getmarginAktif();
    } else {
        result = await getMargin();
    }
    return NextResponse.json(result.error || result.data, { status: result.status });
}

export async function POST(request: Request){
    const body = await request.json();
    const result = await createMargin(body as Omit<Margin, 'idmargin_penjualan'>);
    console.log(result);
    return NextResponse.json(result.error || result.data, {status: result.status})
}

export async function PUT(request: Request){
    const body = await request.json();
    const result = await updateMargin(body as Margin);
    return NextResponse.json(result.error || result.data, {status: result.status})
}

export async function DELETE(request: Request){
    const { idmargin_penjualan } = await request.json();
    const result = await deleteMargin(idmargin_penjualan);
    return NextResponse.json(result.error || result.data, {status: result.status})
}