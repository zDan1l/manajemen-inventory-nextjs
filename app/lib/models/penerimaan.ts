import { getDbConnection } from "@/app/lib/services/db";
import {  ApiResponse, Penerimaan } from "@/app/lib/type";

export async function getPenerimaan(): Promise<ApiResponse<Penerimaan[]>> {
  const db = await getDbConnection();
  try {
  const [penerimaans] = await db.execute(
    'select * from view_penerimaan');

    return {
      status: 200,
      data: penerimaans as Penerimaan[],
    };
  } catch (error) {
    return { status: 500, error: `Failed to fetch Penerimaan: ${error instanceof Error ? error.message : 'Unknown error'}` };
  } finally {
    db.release();
  }
}