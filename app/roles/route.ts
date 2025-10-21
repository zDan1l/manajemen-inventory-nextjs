import { createRole, deleteRole, getRoles, updateRole } from "@/app/lib/models/role";
import { Role } from "@/app/lib/type";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await getRoles();
  return NextResponse.json(result.error || result.data, { status: result.status });
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