"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ApiResponse,
  DetailReturInput,
  DetailPenerimaanForRetur,
} from "@/app/lib/type";
import { Button } from "@/app/components/Button";
import { Card } from "@/app/components/Card";
import { FormInput } from "@/app/components/FormInput";
import { Toast } from "@/app/components/Toast";
import { useToast } from "@/app/hooks/useToast";
import { formatCurrency } from "@/app/lib/utils/format";
import { useAuth } from "@/app/context/AuthContext";

export default function AddReturPage() {
  const router = useRouter();
  const { toast, hideToast, success, error: showError, warning } = useToast();
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [penerimaans, setPenerimaans] = useState<any[]>([]);
  const [filteredPenerimaans, setFilteredPenerimaans] = useState<any[]>([]);
  const [selectedPenerimaan, setSelectedPenerimaan] = useState<number | null>(
    null
  );

  const [searchId, setSearchId] = useState("");
  const [searchVendor, setSearchVendor] = useState("");

  const [breakdown, setBreakdown] = useState<DetailPenerimaanForRetur[]>([]);
  const [details, setDetails] = useState<DetailReturInput[]>([]);

  const iduser = user?.iduser || null;

  useEffect(() => {
    if (step === 1) {
      fetchPenerimaanForRetur();
    }
  }, [step]);

  useEffect(() => {
    let filtered = [...penerimaans];

    if (searchId.trim()) {
      filtered = filtered.filter((p) =>
        p.idpenerimaan.toString().includes(searchId.trim())
      );
    }

    if (searchVendor.trim()) {
      filtered = filtered.filter((p) =>
        p.nama_vendor?.toLowerCase().includes(searchVendor.toLowerCase())
      );
    }

    setFilteredPenerimaans(filtered);
  }, [penerimaans, searchId, searchVendor]);

  const fetchPenerimaanForRetur = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/returs/penerimaan-for-retur");
      const result: ApiResponse<any[]> = await res.json();

      if (result.status === 200 && Array.isArray(result.data)) {
        setPenerimaans(result.data);
        setFilteredPenerimaans(result.data);
      } else {
        showError("Gagal mengambil daftar penerimaan");
      }
    } catch (err) {
      showError("Error mengambil penerimaan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchId("");
    setSearchVendor("");
  };

  const handleSelectPenerimaan = async (idpenerimaan: number) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/returs/breakdown/${idpenerimaan}`);
      const result: ApiResponse<DetailPenerimaanForRetur[]> = await res.json();

      if (result.status === 200 && Array.isArray(result.data)) {
        setSelectedPenerimaan(idpenerimaan);
        setBreakdown(result.data);

        const initialDetails = result.data.map(
          (item: DetailPenerimaanForRetur) => ({
            iddetail_penerimaan: item.iddetail_penerimaan,
            jumlah: 0,
            alasan: "",
            nama: item.nama,
            nama_satuan: item.nama_satuan,
            sisa_bisa_retur: item.sisa_bisa_retur,
          })
        );
        setDetails(initialDetails);

        setStep(2);
      } else {
        showError(result.error || "Gagal mengambil detail penerimaan");
      }
    } catch (err) {
      showError("Error mengambil detail");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDetail = (
    iddetail_penerimaan: number,
    field: "jumlah" | "alasan",
    value: number | string
  ) => {
    setDetails(
      details.map((d) =>
        d.iddetail_penerimaan === iddetail_penerimaan
          ? { ...d, [field]: value }
          : d
      )
    );
  };

  const handleSubmitRetur = async () => {
    if (!selectedPenerimaan || !iduser) {
      warning("Data tidak lengkap. Harap login terlebih dahulu.");
      return;
    }

    const filteredDetails = details.filter(
      (d) => d.jumlah > 0 && d.alasan.trim() !== ""
    );

    if (filteredDetails.length === 0) {
      warning("Minimal satu barang harus diretur dengan alasan yang jelas");
      return;
    }

    const invalidItem = filteredDetails.find((d) => {
      const breakdown_item = breakdown.find(
        (b) => b.iddetail_penerimaan === d.iddetail_penerimaan
      );
      return d.jumlah > (breakdown_item?.sisa_bisa_retur || 0);
    });

    if (invalidItem) {
      const item = breakdown.find(
        (b) => b.iddetail_penerimaan === invalidItem.iddetail_penerimaan
      );
      warning(`Jumlah retur ${item?.nama} melebihi sisa yang bisa diretur`);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        idpenerimaan: selectedPenerimaan,
        iduser: iduser,
        details: filteredDetails.map((d) => ({
          iddetail_penerimaan: Number(d.iddetail_penerimaan),
          jumlah: Number(d.jumlah),
          alasan: d.alasan.trim(),
        })),
      };

      console.log("Payload to send:", JSON.stringify(payload, null, 2));

      const res = await fetch("/api/returs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result: ApiResponse<unknown> = await res.json();
      if (result.status === 201 || result.status === 200) {
        success("Retur berhasil disimpan!");
        setTimeout(() => router.push("/retur"), 1500);
      } else {
        showError(result.error || "Gagal membuat retur");
      }
    } catch (err) {
      showError("Error membuat retur");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {toast.isOpen && (
        <Toast
          isOpen={toast.isOpen}
          message={toast.message}
          variant={toast.variant}
          onClose={hideToast}
        />
      )}

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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {step === 1 ? "Pilih Penerimaan" : "Input Detail Retur"}
              </h1>
              <p className="text-teal-100 mt-1">
                {step === 1
                  ? "Langkah 1 dari 2: Pilih penerimaan yang akan diretur"
                  : `Langkah 2 dari 2: Tentukan jumlah dan alasan retur untuk Penerimaan #${selectedPenerimaan}`}
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step === 1
                  ? "bg-white text-[#00A69F]"
                  : "bg-white/30 text-white"
              } font-bold`}
            >
              1
            </div>
            <div className="w-12 h-1 bg-white/30"></div>
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step === 2
                  ? "bg-white text-[#00A69F]"
                  : "bg-white/30 text-white"
              } font-bold`}
            >
              2
            </div>
          </div>
        </div>
      </div>

      {error && (
        <Card className="bg-red-50 border-red-200">
          <div className="p-4 text-red-700 flex items-center gap-3">
            <svg
              className="w-6 h-6 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        </Card>
      )}

      {step === 1 && (
        <>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-5 h-5 text-[#00A69F]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h2 className="text-lg font-bold text-gray-900">
                Cari Penerimaan
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari berdasarkan ID
                </label>
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Contoh: 1, 2, 3..."
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#00A69F] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari berdasarkan Vendor
                </label>
                <input
                  type="text"
                  value={searchVendor}
                  onChange={(e) => setSearchVendor(e.target.value)}
                  placeholder="Nama vendor..."
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#00A69F] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={handleResetFilters}
              >
                Reset Filter
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Daftar Penerimaan
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Pilih penerimaan yang ingin diretur
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A69F]"></div>
              </div>
            ) : filteredPenerimaans.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p className="text-gray-500 text-lg">
                  Tidak ada penerimaan yang dapat diretur
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Semua penerimaan sudah diretur atau tidak ada data
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPenerimaans.map((p) => (
                  <div
                    key={p.idpenerimaan}
                    onClick={() => handleSelectPenerimaan(p.idpenerimaan)}
                    className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#00A69F] hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            ID Penerimaan
                          </p>
                          <p className="text-xl font-bold text-[#00A69F]">
                            #{p.idpenerimaan}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            Pengadaan #{p.idpengadaan}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500 mb-1">Vendor</p>
                          <p className="font-semibold text-gray-900">
                            {p.nama_vendor || "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Total Item
                          </p>
                          <p className="text-xl font-bold text-gray-900">
                            {p.total_items || 0}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end">
                        <div className="flex items-center gap-2 text-[#00A69F] group-hover:text-[#0D9488] font-medium">
                          <span>Pilih</span>
                          <svg
                            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-6 pt-6 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
              >
                ← Batal
              </Button>
            </div>
          </Card>
        </>
      )}

      {step === 2 && (
        <>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-5 h-5 text-[#00A69F]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <h2 className="text-lg font-bold text-gray-900">
                Informasi Penerima
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="User (Penanggungjawab)"
                type="text"
                value={user?.username || ""}
                onChange={() => {}}
                placeholder="Otomatis terisi dari user login"
                disabled={true}
                helper={`${
                  user?.nama_role || "Role"
                } - Otomatis terisi dari akun yang sedang login`}
              />

              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <svg
                    className="w-8 h-8 text-blue-600 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">
                      Otomatis Terisi
                    </p>
                    <p className="text-xs text-blue-700 mt-0.5">
                      User terisi otomatis sesuai akun yang login
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Detail Barang yang Diretur
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Tentukan jumlah dan alasan retur untuk setiap item
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Item Tersedia</p>
                <p className="text-2xl font-bold text-[#00A69F]">
                  {breakdown.length}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b">
                      Nama Barang
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b">
                      Satuan
                    </th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-700 border-b">
                      Harga Satuan
                    </th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-700 border-b">
                      Qty Diterima
                    </th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-700 border-b">
                      Sudah Retur
                    </th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-700 border-b">
                      Sisa Bisa Retur
                    </th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700 border-b w-32">
                      Qty Retur
                    </th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b w-64">
                      Alasan Retur
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {breakdown.map((item, idx) => {
                    const detail = details.find(
                      (d) => d.iddetail_penerimaan === item.iddetail_penerimaan
                    );
                    const isRetur = (detail?.jumlah || 0) > 0;

                    return (
                      <tr
                        key={item.iddetail_penerimaan}
                        className={`${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-blue-50 transition-colors`}
                      >
                        <td className="p-4 border-b">
                          <span className="font-medium text-gray-900">
                            {item.nama}
                          </span>
                        </td>
                        <td className="p-4 border-b">
                          <span className="text-sm text-gray-600">
                            {item.nama_satuan}
                          </span>
                        </td>
                        <td className="p-4 border-b text-right">
                          <span className="text-sm text-gray-900">
                            {formatCurrency(item.harga_satuan_terima)}
                          </span>
                        </td>
                        <td className="p-4 border-b text-right">
                          <span className="text-sm font-semibold text-gray-700">
                            {item.jumlah_terima}
                          </span>
                        </td>
                        <td className="p-4 border-b text-right">
                          <span className="text-sm text-amber-600 font-medium">
                            {item.jumlah_sudah_retur}
                          </span>
                        </td>
                        <td className="p-4 border-b text-right">
                          <span
                            className={`text-sm font-bold ${
                              item.sisa_bisa_retur > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {item.sisa_bisa_retur}
                          </span>
                        </td>
                        <td className="p-4 border-b">
                          <input
                            type="number"
                            min="0"
                            max={item.sisa_bisa_retur}
                            value={detail?.jumlah || 0}
                            onChange={(e) =>
                              handleUpdateDetail(
                                item.iddetail_penerimaan,
                                "jumlah",
                                parseInt(e.target.value) || 0
                              )
                            }
                            className={`w-full px-3 py-2 border-2 rounded-lg text-center font-semibold focus:outline-none transition-colors ${
                              isRetur
                                ? "border-[#00A69F] bg-teal-50 text-[#00A69F] focus:ring-2 focus:ring-[#00A69F]/20"
                                : "border-gray-300 focus:border-[#00A69F]"
                            }`}
                          />
                        </td>
                        <td className="p-4 border-b">
                          <input
                            type="text"
                            value={detail?.alasan || ""}
                            onChange={(e) =>
                              handleUpdateDetail(
                                item.iddetail_penerimaan,
                                "alasan",
                                e.target.value
                              )
                            }
                            placeholder="Contoh: Barang rusak"
                            className={`w-full px-3 py-2 border-2 rounded-lg text-sm focus:outline-none transition-colors ${
                              isRetur && detail?.alasan
                                ? "border-[#00A69F] bg-teal-50 focus:ring-2 focus:ring-[#00A69F]/20"
                                : "border-gray-300 focus:border-[#00A69F]"
                            }`}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg border border-blue-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Item</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {breakdown.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Item Diretur</p>
                  <p className="text-2xl font-bold text-[#00A69F]">
                    {details.filter((d) => d.jumlah > 0).length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Qty Retur</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {details.reduce((sum, d) => sum + (d.jumlah || 0), 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Total Nilai Retur
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(
                      details.reduce((sum, d) => {
                        const item = breakdown.find(
                          (b) => b.iddetail_penerimaan === d.iddetail_penerimaan
                        );
                        return (
                          sum +
                          (d.jumlah || 0) * (item?.harga_satuan_terima || 0)
                        );
                      }, 0)
                    )}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex gap-3 justify-between">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                ← Kembali
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleSubmitRetur}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Memproses...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Simpan Retur
                  </span>
                )}
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
