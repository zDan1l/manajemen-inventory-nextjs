"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
} from "@/app/components/Card";
import { LinkButton } from "@/app/components/LinkButton";
import { Alert } from "@/app/components/Alert";
import { formatCurrency, formatDate } from "@/app/lib/utils/format";
import { PenjualanDetail } from "@/app/lib/type";

export default function DetailPenjualan({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [penjualan, setPenjualan] = useState<PenjualanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchPenjualanDetail();
  }, [id]);

  const fetchPenjualanDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/penjualans/${id}`);
      const result = await res.json();

      if (result.status === 200 && result.data) {
        setPenjualan(result.data);
      } else {
        setError(result.error || "Gagal mengambil detail penjualan");
      }
    } catch (err) {
      setError("Error mengambil detail penjualan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A69F]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="danger">{error}</Alert>
        <div className="mt-4">
          <LinkButton href="/penjualan" variant="secondary">
            Kembali ke Daftar Penjualan
          </LinkButton>
        </div>
      </div>
    );
  }

  if (!penjualan) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="warning">Penjualan tidak ditemukan</Alert>
        <div className="mt-4">
          <LinkButton href="/penjualan" variant="secondary">
            Kembali ke Daftar Penjualan
          </LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header dengan gradient */}
      <div className="bg-gradient-to-r from-[#00A69F] to-[#0D9488] rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Detail Penjualan #{penjualan.idpenjualan}
            </h1>
            <p className="text-teal-100">
              Informasi lengkap transaksi penjualan
            </p>
          </div>
          <LinkButton href="/penjualan" variant="secondary">
            ← Kembali
          </LinkButton>
        </div>
      </div>

      {/* Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informasi Penjualan</CardTitle>
          <CardDescription>Detail header penjualan</CardDescription>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                ID Penjualan
              </label>
              <p className="text-lg font-semibold text-gray-900">
                #{penjualan.idpenjualan}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tanggal Transaksi
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(penjualan.created_at)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                User Input
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {penjualan.username}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Margin Penjualan
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {penjualan.margin_persen}%
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Detail Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Barang yang Dijual</CardTitle>
          <CardDescription>
            Daftar barang dalam transaksi penjualan ini
          </CardDescription>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Barang
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Satuan
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harga Satuan
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sub Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {penjualan.details.map((item, index) => (
                  <tr
                    key={item.iddetail_penjualan}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.nama_barang}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.nama_satuan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(item.harga_satuan)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                      {item.jumlah}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                      {formatCurrency(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 border-t pt-6">
            <div className="flex justify-end">
              <div className="w-full md:w-1/2 lg:w-1/3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-600">
                      Total Items:
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {penjualan.details.length} item
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-600">
                      Subtotal:
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(penjualan.subtotal_nilai)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-600">
                      PPN ({penjualan.ppn > 0 ? "11%" : "0%"}):
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(penjualan.ppn)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-t-2 border-gray-200">
                    <span className="text-lg font-bold text-gray-900">
                      Total Nilai:
                    </span>
                    <span className="text-xl font-bold text-teal-600">
                      {formatCurrency(penjualan.total_nilai)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4 justify-end">
        <LinkButton href="/penjualan" variant="secondary">
          Kembali ke Daftar
        </LinkButton>
      </div>
    </div>
  );
}
