"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/Button";
import { Card } from "@/app/components/Card";
import { FormInput } from "@/app/components/FormInput";
import { SelectInput } from "@/app/components/SelectInput";
import { Toast } from "@/app/components/Toast";
import { ConfirmDialog } from "@/app/components/ConfirmDialog";
import { useToast } from "@/app/hooks/useToast";
import { useConfirm } from "@/app/hooks/useConfirm";
import { formatCurrency } from "@/app/lib/utils/format";
import {
  ApiResponse,
  BarangTersedia,
  Margin,
  DetailPenjualanInput,
} from "@/app/lib/type";

export default function AddPenjualanPage() {
  const router = useRouter();
  const { toast, hideToast, success, error: showError, warning } = useToast();
  const { confirmState, showConfirm, hideConfirm, handleConfirm } =
    useConfirm();
  const [loading, setLoading] = useState(false);

  // Form state
  const [barangList, setBarangList] = useState<BarangTersedia[]>([]);
  const [marginList, setMarginList] = useState<Margin[]>([]);
  const [selectedMargin, setSelectedMargin] = useState<number | null>(null);
  const [ppn, setPpn] = useState<number>(10); // Input PPN dalam persen (default 10%)
  const [iduser, setIduser] = useState<number>(1); // TODO: Get from auth

  // Detail penjualan
  const [details, setDetails] = useState<DetailPenjualanInput[]>([
    { idbarang: 0, jumlah: 0, harga_jual: 0, sub_total: 0 },
  ]);

  useEffect(() => {
    fetchBarangTersedia();
    fetchMarginList();
  }, []);

  // Fetch barang yang tersedia (stok > 0)
  const fetchBarangTersedia = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/penjualans/barang-tersedia");
      const data = await res.json();
      console.log(data);

      if (Array.isArray(data)) {
        setBarangList(data);
      } else {
        showError("Gagal mengambil daftar barang");
      }
    } catch (err) {
      showError("Error mengambil barang tersedia");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch margin list
  const fetchMarginList = async () => {
    try {
      const res = await fetch("/api/penjualans/margins");
      const data = await res.json();

      if (Array.isArray(data)) {
        setMarginList(data);

        // Set first margin as default
        if (data.length > 0) {
          setSelectedMargin(data[0].idmargin_penjualan);
        }
      }
    } catch (err) {
      console.error("Error fetching margins:", err);
    }
  };

  // Handle change barang di row tertentu
  const handleBarangChange = (index: number, idbarang: number) => {
    const newDetails = [...details];

    // Validasi: cek apakah barang sudah dipilih di row lain
    const isDuplicate = newDetails.some(
      (d, i) => i !== index && d.idbarang === idbarang && idbarang > 0
    );
    if (isDuplicate) {
      warning("Barang sudah dipilih di baris lain. Pilih barang yang berbeda.");
      return;
    }

    const barang = barangList.find((b) => b.idbarang === idbarang);
    const margin = marginList.find(
      (m) => m.idmargin_penjualan === selectedMargin
    );

    // Hitung harga jual = harga beli + (harga beli * margin%)
    const hargaBeli = barang?.harga_beli || 0;
    const marginPersen = margin?.persen || 0;
    const hargaJual = hargaBeli + (hargaBeli * marginPersen) / 100;

    newDetails[index] = {
      idbarang,
      jumlah: 1, // Default jumlah 1 saat barang dipilih
      harga_jual: hargaJual,
      sub_total: hargaJual, // Sub total = 1 * harga jual
      nama_barang: barang?.nama_barang,
      nama_satuan: barang?.nama_satuan,
      stok_tersedia: barang?.stok_tersedia,
      harga_beli: hargaBeli,
    };

    setDetails(newDetails);
  };

  // Handle change jumlah di row tertentu
  const handleJumlahChange = (index: number, jumlah: number) => {
    const newDetails = [...details];
    const stokTersedia = newDetails[index].stok_tersedia || 0;

    // Validasi: jumlah tidak boleh negatif
    if (jumlah < 0) {
      warning("Jumlah tidak boleh negatif");
      return;
    }

    // Validasi: jumlah tidak boleh > stok
    if (jumlah > stokTersedia) {
      warning(`Jumlah melebihi stok tersedia (${stokTersedia})`);
      return;
    }

    newDetails[index].jumlah = jumlah;
    newDetails[index].sub_total = jumlah * newDetails[index].harga_jual;
    setDetails(newDetails);
  };

  // Tambah row detail baru
  const addDetailRow = () => {
    setDetails([
      ...details,
      { idbarang: 0, jumlah: 0, harga_jual: 0, sub_total: 0 },
    ]);
  };

  // Hapus row detail
  const removeDetailRow = (index: number) => {
    if (details.length > 1) {
      const newDetails = details.filter((_, i) => i !== index);
      setDetails(newDetails);
    }
  };

  // Submit penjualan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    if (!selectedMargin) {
      warning("Pilih margin penjualan terlebih dahulu");
      return;
    }

    // Validasi PPN (0-100%)
    if (ppn < 0 || ppn > 100) {
      warning("PPN harus antara 0% - 100%");
      return;
    }

    // Filter details yang valid (idbarang > 0 dan jumlah > 0)
    const validDetails = details.filter((d) => d.idbarang > 0 && d.jumlah > 0);

    if (validDetails.length === 0) {
      warning("Minimal harus ada 1 detail barang yang valid");
      return;
    }

    // Validasi: cek duplikasi barang
    const barangIds = validDetails.map((d) => d.idbarang);
    const hasDuplicate = barangIds.some(
      (id, index) => barangIds.indexOf(id) !== index
    );
    if (hasDuplicate) {
      warning(
        "Terdapat barang yang sama di beberapa baris. Setiap barang hanya boleh dipilih sekali."
      );
      return;
    }

    // Check stok untuk semua detail
    for (const detail of validDetails) {
      const barang = barangList.find((b) => b.idbarang === detail.idbarang);
      if (!barang) {
        showError(`Barang ID ${detail.idbarang} tidak ditemukan`);
        return;
      }
      if (detail.jumlah > barang.stok_tersedia) {
        warning(
          `Stok ${barang.nama_barang} tidak mencukupi. Tersedia: ${barang.stok_tersedia}`
        );
        return;
      }
      if (detail.jumlah <= 0) {
        warning(`Jumlah untuk ${barang.nama_barang} harus lebih dari 0`);
        return;
      }
    }

    // Show confirmation dialog
    showConfirm(
      "Konfirmasi Transaksi Penjualan",
      `Apakah Anda yakin ingin menyimpan transaksi penjualan ini?\n\n${validDetails.length} item akan dijual.\n\nTransaksi yang sudah disimpan TIDAK DAPAT DIEDIT atau DIHAPUS.`,
      confirmSubmit,
      "info"
    );
  };

  // Actual submission after confirmation
  const confirmSubmit = async () => {
    const validDetails = details.filter((d) => d.idbarang > 0 && d.jumlah > 0);

    try {
      setLoading(true);

      // Hitung subtotal dari semua detail
      const calculatedSubtotal = validDetails.reduce(
        (sum, d) => sum + d.sub_total,
        0
      );
      // Hitung PPN dalam Rupiah
      const ppnNilai = calculatedSubtotal * (ppn / 100);

      const payload = {
        idmargin_penjualan: selectedMargin,
        iduser: iduser,
        ppn: ppnNilai, // PPN dalam Rupiah (bukan persen!)
        details: validDetails.map((d) => ({
          idbarang: d.idbarang,
          jumlah: d.jumlah,
        })),
      };

      console.log("Sending POST /api/penjualans:", payload);

      const res = await fetch("/api/penjualans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log("Response:", result);

      // Check HTTP status dan response status
      if (res.ok && result.status === 201 && result.data) {
        success(`Penjualan berhasil dibuat! ID: ${result.data.idpenjualan}`);
        setTimeout(() => router.push("/penjualan"), 1500);
      } else {
        showError(result.error || "Gagal membuat penjualan");
      }
    } catch (err) {
      showError("Error membuat penjualan");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate summary (preview harga)
  const validDetails = details.filter((d) => d.idbarang > 0 && d.jumlah > 0);
  const totalItems = validDetails.length;
  const totalQty = validDetails.reduce((sum, d) => sum + d.jumlah, 0);
  const subtotalNilai = validDetails.reduce((sum, d) => sum + d.sub_total, 0);
  const ppnNilai = subtotalNilai * (ppn / 100); // PPN dalam Rupiah

  // Dapatkan margin persen dari margin yang dipilih
  const selectedMarginObj = marginList.find(
    (m) => m.idmargin_penjualan === selectedMargin
  );
  const marginPersen = selectedMarginObj?.persen || 0;
  const marginNilai = subtotalNilai * (marginPersen / 100); // Margin dalam Rupiah

  const totalNilai = subtotalNilai + ppnNilai + marginNilai;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Toast Notification */}
      {toast.isOpen && (
        <Toast
          isOpen={toast.isOpen}
          message={toast.message}
          variant={toast.variant}
          onClose={hideToast}
        />
      )}

      {/* Loading State */}
      {loading && barangList.length === 0 && (
        <Card>
          <div className="p-6 text-center">
            <div className="flex justify-center items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#00A69F]"></div>
              <span className="text-gray-600">
                Memuat data barang dan margin...
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Warning: No Stock Available */}
      {!loading && barangList.length === 0 && (
        <Card>
          <div className="p-6 bg-yellow-50 border-l-4 border-yellow-400">
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <p className="font-semibold text-yellow-800">
                  Tidak ada barang tersedia
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Silakan lakukan penerimaan barang terlebih dahulu untuk dapat
                  membuat penjualan.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Warning: No Margin Active */}
      {!loading && marginList.length === 0 && (
        <Card>
          <div className="p-6 bg-yellow-50 border-l-4 border-yellow-400">
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <p className="font-semibold text-yellow-800">
                  Tidak ada margin aktif
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Silakan tambahkan margin penjualan aktif terlebih dahulu.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Main Form Card */}
      <Card>
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-[#00A69F] to-[#0D9488] text-white p-6 rounded-t-lg">
          <div className="flex items-center gap-3">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <div>
              <h1 className="text-2xl font-bold">Transaksi Penjualan Baru</h1>
              <p className="text-white/90 text-sm mt-1">
                Buat transaksi penjualan dengan pilihan barang yang tersedia
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Informasi Penjualan */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
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
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Informasi Penjualan
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <SelectInput
                    label="Margin Penjualan"
                    value={selectedMargin?.toString() || ""}
                    onChange={(e) => setSelectedMargin(Number(e.target.value))}
                    options={[
                      { value: "", label: "-- Pilih Margin --" },
                      ...marginList.map((m) => ({
                        value: m.idmargin_penjualan.toString(),
                        label: `${m.persen}% Margin`,
                      })),
                    ]}
                    required
                  />
                </div>

                <div>
                  <FormInput
                    label="PPN (%)"
                    type="number"
                    value={ppn}
                    onChange={(e) => setPpn(Number(e.target.value))}
                    placeholder="PPN 10%"
                    disabled={true}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    PPN tetap 10% sesuai ketentuan. Nilai PPN akan dihitung
                    otomatis dari subtotal.
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Detail Barang */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
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
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  Detail Barang
                </h2>
                <Button
                  type="button"
                  onClick={addDetailRow}
                  variant="primary"
                  disabled={loading}
                >
                  + Tambah Baris
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                      <th className="p-3 text-left text-sm font-semibold text-gray-700">
                        Barang & Satuan
                      </th>
                      <th className="p-3 text-center text-sm font-semibold text-gray-700 w-24">
                        Stok
                      </th>
                      <th className="p-3 text-right text-sm font-semibold text-gray-700 w-32">
                        Harga Jual
                      </th>
                      <th className="p-3 text-center text-sm font-semibold text-gray-700 w-24">
                        Jumlah
                      </th>
                      <th className="p-3 text-right text-sm font-semibold text-gray-700 w-32">
                        Sub Total
                      </th>
                      <th className="p-3 text-center text-sm font-semibold text-gray-700 w-24">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((detail, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-blue-50/50 transition-colors"
                      >
                        <td className="p-3">
                          <select
                            value={detail.idbarang}
                            onChange={(e) =>
                              handleBarangChange(index, Number(e.target.value))
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00A69F] focus:border-transparent"
                            required
                          >
                            <option value={0}>-- Pilih Barang --</option>
                            {barangList.map((barang) => (
                              <option
                                key={barang.idbarang}
                                value={barang.idbarang}
                              >
                                {barang.nama_barang} ({barang.nama_satuan})
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="text"
                            value={detail.stok_tersedia || 0}
                            disabled
                            className="w-20 p-2 text-center bg-gray-100 text-gray-600 rounded-md border border-gray-300"
                          />
                        </td>
                        <td className="p-3 text-right">
                          <span className="text-sm text-gray-700">
                            {detail.idbarang > 0
                              ? formatCurrency(detail.harga_jual)
                              : "-"}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            value={detail.jumlah}
                            onChange={(e) =>
                              handleJumlahChange(index, Number(e.target.value))
                            }
                            min={1}
                            max={detail.stok_tersedia || 0}
                            step={1}
                            className="w-20 p-2 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-[#00A69F] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                            required
                            disabled={!detail.idbarang}
                          />
                        </td>
                        <td className="p-3 text-right">
                          <span className="text-sm font-semibold text-gray-700">
                            {detail.sub_total > 0
                              ? formatCurrency(detail.sub_total)
                              : "-"}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {details.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeDetailRow(index)}
                              className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
                            >
                              Hapus
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
              <h3 className="text-md font-semibold text-gray-800 mb-3">
                Ringkasan Transaksi
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-200">
                  <p className="text-xs text-gray-600 mb-1">Total Item</p>
                  <p className="text-lg font-bold text-[#00A69F]">
                    {totalItems}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-200">
                  <p className="text-xs text-gray-600 mb-1">Total Qty</p>
                  <p className="text-lg font-bold text-[#00A69F]">{totalQty}</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-200">
                  <p className="text-xs text-gray-600 mb-1">Subtotal</p>
                  <p className="text-lg font-bold text-gray-700">
                    {formatCurrency(subtotalNilai)}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-200">
                  <p className="text-xs text-gray-600 mb-1">
                    Margin ({marginPersen}%)
                  </p>
                  <p className="text-lg font-bold text-gray-700">
                    {formatCurrency(marginNilai)}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-200">
                  <p className="text-xs text-gray-600 mb-1">PPN ({ppn}%)</p>
                  <p className="text-lg font-bold text-gray-700">
                    {formatCurrency(ppnNilai)}
                  </p>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-md border-2 border-[#00A69F]">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-gray-700">
                    Total Bayar
                  </p>
                  <p className="text-2xl font-bold text-[#00A69F]">
                    {formatCurrency(totalNilai)}
                  </p>
                </div>
              </div>
              {totalItems > 0 && (
                <p className="text-xs text-gray-600 mt-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
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
                  Preview perhitungan harga. Nilai final akan dihitung saat
                  menyimpan.
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/penjualan")}
                disabled={loading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={
                  loading || barangList.length === 0 || marginList.length === 0
                }
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Menyimpan...
                  </span>
                ) : (
                  "Simpan Penjualan"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmText="Ya, Simpan"
        cancelText="Periksa Kembali"
        onConfirm={handleConfirm}
        onCancel={hideConfirm}
        variant={confirmState.variant}
      />
    </div>
  );
}
