import { NextResponse } from "next/server";
import { getUserById } from "@/app/lib/models/users";


export async function GET(request: Request, {params} : {params : {id? : string[]}}){
    const id = params.id?.[0];
    if(!id){
        return NextResponse.json({error : 'Missing ID'}, {status : 400});
    }

    const result = await getUserById(parseInt(id));
    return NextResponse.json(result.error || result.data, {status : result.status});
}