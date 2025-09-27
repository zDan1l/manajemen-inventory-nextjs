
import { createVendor, deleteVendor, getVendor, updateVendor } from "@/app/lib/models/vendor";
import { Vendor } from "@/app/lib/type";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await getVendor();
  return NextResponse.json(result.error || result.data, { status: result.status });
}

export async function POST(request: Request){
    const body = await request.json();
    const result = await createVendor(body as Omit<Vendor, 'idvendor'>);
    return NextResponse.json(result.error || result.data, {status: result.status})
}

export async function PUT(request: Request){
    const body = await request.json();
    const result = await updateVendor(body as Vendor);
    return NextResponse.json(result.error || result.data, {status: result.status})
}

export async function DELETE(request: Request){
    const { idvendor } = await request.json();
    const result = await deleteVendor(idvendor);
    return NextResponse.json(result.error || result.data, {status: result.status})
}