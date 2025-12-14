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
import { PenerimaanDetail } from "@/app/lib/type";

export default function DetailPenerimaan({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [penerimaan, setPenerimaan] = useState<PenerimaanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const mapStatusToString = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      C: "Selesai",
    };
    return statusMap[status] || status;
  };

  const getStatusBadgeClass = (status: string): string => {
    const statusClasses: { [key: string]: string } = {
      I: "bg-yellow-100 text-yellow-800",
      V: "bg-[#00A69F]/10 text-[#00A69F] border border-[#00A69F]/30",
      A: "bg-green-100 text-green-800",
    };
    return statusClasses[status] || "bg-gray-100 text-gray-800";
  };

  useEffect(() => {
    fetchPenerimaanDetail();
  }, [id]);

  const fetchPenerimaanDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/penerimaans/${id}`);
      const result = await res.json();

      if (result.status === 200 && result.data) {
        setPenerimaan(result.data);
      } else {
        setError(result.error || "Gagal mengambil detail penerimaan");
      }
    } catch (err) {
      setError("Error mengambil detail penerimaan");
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
          <LinkButton href="/penerimaan" variant="secondary">
            Kembali ke Daftar Penerimaan
          </LinkButton>
        </div>
      </div>
    );
  }

  if (!penerimaan) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="warning">Penerimaan tidak ditemukan</Alert>
        <div className="mt-4">
          <LinkButton href="/penerimaan" variant="secondary">
            Kembali ke Daftar Penerimaan
          </LinkButton>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-6">

      <div className="bg-gradient-to-r from-[#00A69F] to-[#0D9488] rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Detail Penerimaan #{penerimaan.idpenerimaan}
            </h1>
            <p className="text-teal-100">Informasi lengkap penerimaan barang</p>
          </div>
          <LinkButton href="/penerimaan" variant="secondary">
            ← Kembali
          </LinkButton>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informasi Penerimaan</CardTitle>
          <CardDescription>Detail header penerimaan</CardDescription>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                ID Penerimaan
              </label>
              <p className="text-lg font-semibold text-gray-900">
                #{penerimaan.idpenerimaan}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tanggal Penerimaan
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(penerimaan.created_at)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                ID Pengadaan
              </label>
              <p className="text-lg font-semibold text-gray-900">
                #{penerimaan.details[0].idpengadaan}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                User Input
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {penerimaan.username}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Vendor
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {penerimaan.details[0].nama_vendor}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Status
              </label>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                  penerimaan.status
                )}`}
              >
                {mapStatusToString(penerimaan.status)}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detail Barang yang Diterima</CardTitle>
          <CardDescription>
            Daftar barang yang diterima dalam penerimaan ini
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
                    Jumlah Terima
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sub Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sudah Retur
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sisa Bisa Retur
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {penerimaan.details.map((item, index) => (
                  <tr
                    key={item.iddetail_penerimaan}
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
                      {formatCurrency(item.harga_satuan_terima)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                      {item.jumlah_terima}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                      {formatCurrency(item.sub_total_terima)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {item.jumlah_sudah_retur || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span
                        className={`font-semibold ${
                          (item.sisa_bisa_retur || 0) > 0
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {item.sisa_bisa_retur || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 border-t pt-6">
            <div className="flex justify-end">
              <div className="w-full md:w-1/2 lg:w-1/3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-600">
                      Total Items:
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {penerimaan.details.length} item
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-t-2 border-gray-200">
                    <span className="text-lg font-bold text-gray-900">
                      Total Nilai:
                    </span>
                    <span className="text-xl font-bold text-teal-600">
                      {formatCurrency(
                        penerimaan.details.reduce(
                          (sum, item) => sum + item.sub_total_terima,
                          0
                        )
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="mt-6 flex gap-4 justify-end">
        <LinkButton href="/penerimaan" variant="secondary">
          Kembali ke Daftar
        </LinkButton>
        {penerimaan.status === "I" && (
          <LinkButton href={`/penerimaan/edit/${id}`} variant="primary">
            Edit Penerimaan
          </LinkButton>
        )}
      </div>
    </div>
  );
}