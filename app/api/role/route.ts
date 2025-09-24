import { createRole, deleteRole, getRoles, updateRole } from "@/app/lib/models/role";
import { Role } from "@/app/lib/type";
import { NextResponse } from "next/server";

export async function GET(request: Request){
    const {searchParams} = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';
    const result = await getRoles({page, pageSize, search});
    return NextResponse.json(result.error || result.data, {status: result.status})
}

export async function POST(request: Request){
    const body = await request.json();
    const result = await createRole(body as Omit<Role, 'idrole'>);
    return NextResponse.json(result.error || result.data, {status: result.status})
}

export async function PUT(request: Request){
    const body = await request.json();
    const result = await updateRole(body as Role);
    return NextResponse.json(result.error || result.data, {status: result.status})
}

export async function DELETE(request: Request){
    const { idrole } = await request.json();
    const result = await deleteRole(idrole);
    return NextResponse.json(result.error || result.data, {status: result.status})
}