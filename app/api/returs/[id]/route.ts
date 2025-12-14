import { getReturById } from "@/app/lib/models/retur";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  const id = unwrappedParams.id;

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  const result = await getReturById(Number(id));
  return NextResponse.json(
    result.error ? { status: result.status, error: result.error } : { status: result.status, data: result.data },
    { status: result.status }
  );
}