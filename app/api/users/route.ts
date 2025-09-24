import { NextResponse } from "next/server";
import { User } from "@/app/lib/type";
import { createUser, deleteUser, getUsers, updateUser } from "@/app/lib/models/users";


export async function GET() {
  const result = await getUsers();
  return NextResponse.json(result.error || result.data, { status: result.status });
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