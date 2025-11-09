import { getPenerimaanById } from "@/app/lib/models/penerimaans";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { status: 400, error: "Missing penerimaan ID" },
        { status: 400 }
      );
    }

    const result = await getPenerimaanById(Number(id));
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        error: `Failed to fetch penerimaan: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}
