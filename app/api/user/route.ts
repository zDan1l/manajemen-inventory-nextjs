import { NextResponse } from "next/server";
import { User } from "@/app/lib/type";
import { createUser, deleteUser, getUsers, updateUser } from "@/app/lib/models/users";


export async function GET(request: Request){
    const {searchParams} = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';
    const result = await getUsers({page, pageSize, search});
    return NextResponse.json(result.error || result.data, {status: result.status})
}

export async function POST(request: Request){
    const body = await request.json();
    const result = await createUser(body as Omit<User, 'iduser' | 'role.name'>);
    return NextResponse.json(result.error || result.data, {status: result.status})
}

export async function PUT(request: Request) {
    const body = await request.json();
    const result = await updateUser(body as User);
    return NextResponse.json(result.error || result.data, { status: result.status });
}

export async function DELETE(request: Request){
    const { iduser } = await request.json();
    const result = await deleteUser(iduser);
    return NextResponse.json(result.error || result.data, {status: result.status})
}