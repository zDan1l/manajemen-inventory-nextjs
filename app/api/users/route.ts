import { NextResponse } from "next/server";
import { User } from "@/app/lib/type";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "@/app/lib/models/users";

export async function GET() {
  const result = await getUsers();
  return NextResponse.json(result.error || result.data, {
    status: result.status,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  console.log("POST /api/users - Received body:", body);

  const result = await createUser(body as Omit<User, "iduser" | "role_name">);
  console.log("POST /api/users - Result:", result);

  if (result.error) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status }
    );
  }

  return NextResponse.json(result.data, { status: result.status });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const result = await updateUser(body as User);
  return NextResponse.json(result.error || result.data, {
    status: result.status,
  });
}

export async function DELETE(request: Request) {
  const { iduser } = await request.json();
  const result = await deleteUser(iduser);
  return NextResponse.json(result.error || result.data, {
    status: result.status,
  });
}
