import { getVendorById } from "@/app/lib/models/vendor";
import { NextResponse } from "next/server";

export async function GET(request: Request, {params}: {params: Promise<{ id: string[] }> }){
    const unwrappedParams = await params;
    const id = unwrappedParams.id;
    if(!id){
        return NextResponse.json({error : 'Missing ID'}, {status : 400});
    }
    const result = await getVendorById(Number(id))
    return NextResponse.json(result.error || result.data, {status: result.status})
}
