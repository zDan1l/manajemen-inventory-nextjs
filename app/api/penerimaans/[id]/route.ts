import {
  getPenerimaanById,
  getDetailPenerimaan,
} from "@/app/lib/models/penerimaans";
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

    // Get penerimaan header from view
    const penerimaanResult = await getPenerimaanById(Number(id));
    if (penerimaanResult.status !== 200 || !penerimaanResult.data) {
      return NextResponse.json(penerimaanResult, {
        status: penerimaanResult.status,
      });
    }

    // Get detail items from view
    const detailResult = await getDetailPenerimaan(Number(id));
    if (detailResult.status !== 200) {
      return NextResponse.json(detailResult, { status: detailResult.status });
    }

    // Combine header with details
    return NextResponse.json(
      {
        status: 200,
        data: {
          ...penerimaanResult.data,
          details: detailResult.data || [],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        error: `Failed to fetch penerimaan: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
