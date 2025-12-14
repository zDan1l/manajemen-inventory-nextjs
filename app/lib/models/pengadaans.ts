import { getDbConnection } from "@/app/lib/services/db";
import { ApiResponse, Pengadaan, DetailPengadaan } from "@/app/lib/type";
import mysql from "mysql2/promise";

export async function getPengadaan(): Promise<ApiResponse<Pengadaan[]>> {
  const db = await getDbConnection();
  try {
    const [pengadaans] = await db.execute("SELECT * FROM view_pengadaan");
    return {
      status: 200,
      data: pengadaans as Pengadaan[],
    };
  } catch (error) {
    return {
      status: 500,
      error: `Failed to fetch Pengadaan: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  } finally {
    db.release();
  }
}

export async function getPengadaanById(
  id: number
): Promise<ApiResponse<Pengadaan>> {
  if (!id) {
    return { status: 400, error: "Missing ID" };
  }

  const db = await getDbConnection();
  try {
    const [pengadaans] = await db.execute(
      "SELECT * FROM view_pengadaan WHERE idpengadaan = ?",
      [id]
    );
    const pengadaanArray = pengadaans as Pengadaan[];

    if (pengadaanArray.length === 0) {
      return { status: 404, error: "Pengadaan not found" };
    }

    return { status: 200, data: pengadaanArray[0] };
  } catch (error) {
    return {
      status: 500,
      error: `Failed to fetch pengadaan: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  } finally {
    db.release();
  }
}

export async function getDetailPengadaan(
  idpengadaan: number
): Promise<ApiResponse<DetailPengadaan[]>> {
  if (!idpengadaan) {
    return { status: 400, error: "Missing pengadaan ID" };
  }

  const db = await getDbConnection();
  try {
    const [details] = await db.execute(
      "SELECT * FROM view_detail_pengadaan WHERE idpengadaan = ?",
      [idpengadaan]
    );
    return { status: 200, data: details as DetailPengadaan[] };
  } catch (error) {
    return {
      status: 500,
      error: `Failed to fetch detail: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  } finally {
    db.release();
  }
}

export async function createPengadaan(data: {
  user_iduser: number;
  vendor_idvendor: number;
  ppn_nilai: number;
  details: Array<{
    idbarang: number;
    jumlah: number;
    harga_satuan: number;
  }>;
}): Promise<ApiResponse<{ idpengadaan: number }>> {
  if (!data.user_iduser || !data.vendor_idvendor) {
    return {
      status: 400,
      error: "Missing required fields: user_iduser, vendor_idvendor",
    };
  }

  if (
    data.ppn_nilai === undefined ||
    data.ppn_nilai === null ||
    data.ppn_nilai < 0
  ) {
    return { status: 400, error: "PPN nilai must be >= 0" };
  }

  if (!data.details || data.details.length === 0) {
    return { status: 400, error: "At least one detail item is required" };
  }

  const db = await getDbConnection();

  try {
    console.log("=== CREATE PENGADAAN START ===");
    console.log("Input data:", JSON.stringify(data, null, 2));

    console.log("Step 1: Calling sp_tambah_pengadaan (create header)...");

    const [headerResult] = await db.execute(
      "CALL sp_tambah_pengadaan(?, ?, ?, @new_pengadaan_id)",
      [data.user_iduser, data.vendor_idvendor, data.ppn_nilai]
    );

    const [idResult] = await db.execute(
      "SELECT @new_pengadaan_id as idpengadaan"
    );
    const idpengadaan = (idResult as any)[0].idpengadaan;

    if (!idpengadaan) {
      console.error("❌ ID pengadaan is null/undefined");
      throw new Error("Failed to create pengadaan header");
    }

    console.log(
      "✅ Step 1 Success: Pengadaan header created with ID:",
      idpengadaan
    );

    console.log(data.details);

    const detailsJson = JSON.stringify(data.details);
    console.log("Details JSON:", detailsJson);
    console.log("Item count:", data.details.length);

    try {
      const [detailResult] = await db.execute(
        "CALL sp_tambah_detail_pengadaan(?, ?, ?)",
        [idpengadaan, data.details.length, detailsJson]
      );
      console.log("✅ Step 2 Success: All details added via SQL looping");
    } catch (detailError) {
      console.error("❌ Detail SP Error:", detailError);
      throw detailError;
    }

    console.log("✅ PENGADAAN CREATED SUCCESSFULLY!");
    console.log(`   ID: ${idpengadaan}`);
    console.log(`   Items: ${data.details.length}`);

    return {
      status: 201,
      data: { idpengadaan },
    };
  } catch (error) {
    console.error("❌ ERROR in createPengadaan:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return {
      status: 500,
      error: `Failed to create pengadaan: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  } finally {
    db.release();
  }
}

export async function updateStatusPengadaan(
  idpengadaan: number
): Promise<ApiResponse<{ message: string }>> {
  if (!idpengadaan) {
    return { status: 400, error: "Missing pengadaan ID" };
  }

  const db = await getDbConnection();
  try {
    await db.execute("CALL sp_update_status_pengadaan(?)", [idpengadaan]);

    return {
      status: 200,
      data: { message: "Status updated successfully" },
    };
  } catch (error) {
    return {
      status: 500,
      error: `Failed to update status: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  } finally {
    db.release();
  }
}

export async function batalkanPengadaan(
  idpengadaan: number
): Promise<ApiResponse<{ message: string }>> {
  if (!idpengadaan) {
    return { status: 400, error: "Missing pengadaan ID" };
  }

  const db = await getDbConnection();
  try {
    await db.execute("CALL sp_batal_pengadaan(?)", [idpengadaan]);

    return {
      status: 200,
      data: { message: "Pengadaan cancelled successfully" },
    };
  } catch (error) {
    return {
      status: 400,
      error: error instanceof Error ? error.message : "Cannot cancel pengadaan",
    };
  } finally {
    db.release();
  }
}
