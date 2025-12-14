"use client";

import { useEffect, useState } from "react";
import { ApiResponse, Retur } from "@/app/lib/type";
import { LinkButton } from "@/app/components/LinkButton";
import { Table } from "@/app/components/Table";
import { formatCurrency, formatDate } from "@/app/lib/utils/format";

export default function ReturPage() {
  const [returs, setReturs] = useState<Retur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReturs();
  }, []);

  const fetchReturs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/returs");
      const result: ApiResponse<Retur[]> = await res.json();

      if (result.status === 200) {
        setReturs(Array.isArray(result.data) ? result.data : []);
        setError(null);
      } else {
        setError(result.error || "Failed to fetch retur");
      }
    } catch (err) {
      setError("Error fetching retur");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A69F]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error: {error}
        </div>
      </div>
    );
  }

  const columns = [
    { key: "idretur", label: "ID Retur" },
    { key: "created_at", label: "Tanggal" },
    { key: "idpenerimaan", label: "ID Penerimaan" },
    { key: "nama_vendor", label: "Vendor" },
    { key: "username", label: "User" },
    { key: "total_items", label: "Total Item" },
    { key: "total_qty_retur", label: "Total Qty" },
    { key: "total_nilai_retur", label: "Total Nilai" },
  ];

  return (
    <div className="space-y-6">

      <div className="bg-gradient-to-r from-[#00A69F] to-[#0D9488] rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Manajemen Retur</h1>
            <p className="text-teal-100 mt-1">
              Kelola pengembalian barang yang rusak atau tidak sesuai
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <LinkButton href="/retur/add" variant="primary" size="lg">
          + Tambah Retur Baru
        </LinkButton>
      </div>

      <Table
        data={returs.map((retur) => ({
          ...retur,
          idretur: `#${retur.idretur}`,
          created_at: formatDate(retur.created_at),
          idpenerimaan: `#${retur.idpenerimaan}`,
          nama_vendor: retur.nama_vendor || "-",
          username: retur.username || `User #${retur.iduser}`,
          total_items: retur.total_items || 0,
          total_qty_retur: retur.total_qty_retur || 0,
          total_nilai_retur: retur.total_nilai_retur
            ? formatCurrency(retur.total_nilai_retur)
            : "Rp 0",
        }))}
        columns={columns}
        idKey="idretur"
        isTransaction={true}
        loading={loading}
        hideActions={true}
      />

      {returs.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              className="w-16 h-16 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
              />
            </svg>
            <p className="text-gray-500 text-lg">Belum ada data retur</p>
            <p className="text-gray-400 text-sm mt-2">
              Klik tombol "Tambah Retur Baru" untuk memulai
            </p>
          </div>
        </div>
      )}
    </div>
  );
}