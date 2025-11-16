import { getRetur, createRetur } from "@/app/lib/models/retur";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const result = await getRetur();
  return NextResponse.json(
    result.error ? { status: result.status, error: result.error } : { status: result.status, data: result.data },
    { status: result.status }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createRetur(body);
    return NextResponse.json(
      result.error ? { status: result.status, error: result.error } : { status: result.status, data: result.data },
      { status: result.status }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 500, error: 'Invalid request body' },
      { status: 500 }
    );
  }
}
