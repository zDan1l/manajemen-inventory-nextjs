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
import { PengadaanDetail } from "@/app/lib/type";

export default function DetailPengadaan({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [pengadaan, setPengadaan] = useState<PengadaanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const mapStatusToString = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      P: "Diproses",
      S: "Sebagian",
      C: "Selesai",
      B: "Batal",
    };
    return statusMap[status] || status;
  };

  const getStatusBadgeClass = (status: string): string => {
    const statusClasses: { [key: string]: string } = {
      P: "bg-blue-100 text-blue-800 border-blue-200",
      S: "bg-yellow-100 text-yellow-800 border-yellow-200",
      C: "bg-green-100 text-green-800 border-green-200",
      B: "bg-red-100 text-red-800 border-red-200",
    };
    return statusClasses[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/pengadaans/${id}`);
        const result = await res.json();
        if (res.ok && result.data) {
          setPengadaan(result.data);
        } else {
          setError(result.error || "Gagal memuat detail pengadaan");
        }
      } catch (err) {
        setError("Gagal memuat detail pengadaan");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A69F]"></div>
          <p className="mt-4 text-gray-600">Memuat detail pengadaan...</p>
        </div>
      </div>
    );
  }

  if (error || !pengadaan) {
    return (
      <div className="space-y-6">
        <Alert
          variant="danger"
          title="Error"
          onClose={() => router.push("/pengadaan")}
        >
          {error || "Data tidak ditemukan"}
        </Alert>
        <LinkButton href="/pengadaan" variant="outline">
          Kembali ke Daftar Pengadaan
        </LinkButton>
      </div>
    );
  }
  console.log(pengadaan);

  return (
    <div className="space-y-6">

      <div className="bg-gradient-to-r from-[#00A69F] to-[#0D9488] rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Detail Pengadaan
              </h1>
              <p className="text-teal-100 mt-1">
                Pengadaan #{pengadaan.idpengadaan}
              </p>
            </div>
          </div>
          <LinkButton
            href="/pengadaan"
            variant="outline"
            className="text-white border-white hover:bg-white/20"
          >
            Kembali
          </LinkButton>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Informasi Pengadaan</CardTitle>
              <CardDescription>
                Detail informasi transaksi pengadaan
              </CardDescription>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusBadgeClass(
                pengadaan.status
              )}`}
            >
              {mapStatusToString(pengadaan.status)}
            </span>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  ID Pengadaan
                </label>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  #{pengadaan.idpengadaan}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Tanggal
                </label>
                <p className="text-lg text-gray-900 mt-1">
                  {formatDate(pengadaan.tanggal)}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </label>
                <p className="text-lg text-gray-900 mt-1">
                  {pengadaan.username}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Vendor
                </label>
                <p className="text-lg text-gray-900 mt-1">
                  {pengadaan.details[0].nama_vendor}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </label>
                <p className="text-lg text-gray-900 mt-1">
                  {mapStatusToString(pengadaan.status)}
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detail Barang</CardTitle>
          <CardDescription>Daftar barang dalam pengadaan ini</CardDescription>
        </CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Nama Barang
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Satuan
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Harga Satuan
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Sub Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pengadaan.details.map((detail, index) => (
                  <tr
                    key={detail.iddetail_pengadaan}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {detail.nama_barang}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {detail.nama_satuan}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900 font-medium">
                      {formatCurrency(detail.harga_satuan)}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900 font-semibold">
                      {detail.jumlah}
                    </td>
                    <td className="px-6 py-4 text-sm text-right text-gray-900 font-bold">
                      {formatCurrency(detail.sub_total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 border-t-2 border-gray-200 pt-6">
            <div className="flex justify-end">
              <div className="w-full md:w-1/2 lg:w-1/3 space-y-3">
                <div className="flex justify-between items-center pb-2">
                  <span className="text-sm font-semibold text-gray-600">
                    Subtotal:
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(pengadaan.subtotal_nilai)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-sm font-semibold text-gray-600">
                    PPN:
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(pengadaan.ppn)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-[#00A69F]">
                  <span className="text-base font-bold text-gray-700">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-[#00A69F]">
                    {formatCurrency(pengadaan.total_nilai)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="flex gap-3 justify-end">
        <LinkButton href="/pengadaan" variant="outline" size="lg">
          Kembali ke Daftar
        </LinkButton>
        {pengadaan.status === "P" && (
          <LinkButton
            href={`/pengadaan/edit/${pengadaan.idpengadaan}`}
            variant="primary"
            size="lg"
          >
            Edit Pengadaan
          </LinkButton>
        )}
      </div>
    </div>
  );
}