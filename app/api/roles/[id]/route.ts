import { getRoleById } from "@/app/lib/models/role";
import { NextResponse } from "next/server";

export async function GET(request: Request, {params}: {params: {id:string[]}}){
    const id = params.id?.[0];
    if(!id){
        return NextResponse.json({error: 'Missing ID'}, {status: 400});
    }
    const result = await getRoleById(Number(id))
    return NextResponse.json(result.error || result.data, {status: result.status})

}