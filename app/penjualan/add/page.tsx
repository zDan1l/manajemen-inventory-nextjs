'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/Button';
import { ApiResponse } from '@/app/lib/type';
import { ConfirmDialog } from '@/app/components/ConfirmDialog';

interface BarangTersedia {
  idbarang: number;
  nama_barang: string;
  nama_satuan: string;
  harga_beli: number;
  status: string;
  stok_tersedia: number;
}

interface Margin {
  idmargin_penjualan: number;
  persen: number;
  status: string;
}

interface DetailInput {
  idbarang: number;
  jumlah: number;
  nama_barang?: string;
  nama_satuan?: string;
  stok_tersedia?: number;
}

export default function AddPenjualanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Form state
  const [barangList, setBarangList] = useState<BarangTersedia[]>([]);
  const [marginList, setMarginList] = useState<Margin[]>([]);
  const [selectedMargin, setSelectedMargin] = useState<number | null>(null);
  const [ppn, setPpn] = useState<number>(0); // Input PPN dalam persen (0-100)
  const [iduser, setIduser] = useState<number>(1); // TODO: Get from auth
  
  // Detail penjualan
  const [details, setDetails] = useState<DetailInput[]>([
    { idbarang: 0, jumlah: 0 }
  ]);

  useEffect(() => {
    fetchBarangTersedia();
    fetchMarginList();
  }, []);

  // Fetch barang yang tersedia (stok > 0)
  const fetchBarangTersedia = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/penjualans/barang-tersedia');
      const data = await res.json();
      console.log(data);
      
      if (Array.isArray(data)) {
        setBarangList(data);
      } else {
        setError('Gagal mengambil daftar barang');
      }
    } catch (err) {
      setError('Error mengambil barang tersedia');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch margin list
  const fetchMarginList = async () => {
    try {
      const res = await fetch('/api/penjualans/margins');
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setMarginList(data);
        
        // Set first margin as default
        if (data.length > 0) {
          setSelectedMargin(data[0].idmargin_penjualan);
        }
      }
    } catch (err) {
      console.error('Error fetching margins:', err);
    }
  };

  // Handle change barang di row tertentu
  const handleBarangChange = (index: number, idbarang: number) => {
    const newDetails = [...details];
    
    // Validasi: cek apakah barang sudah dipilih di row lain
    const isDuplicate = newDetails.some((d, i) => i !== index && d.idbarang === idbarang && idbarang > 0);
    if (isDuplicate) {
      setError('Barang sudah dipilih di baris lain. Pilih barang yang berbeda.');
      return;
    }
    
    const barang = barangList.find(b => b.idbarang === idbarang);
    
    newDetails[index] = {
      idbarang,
      jumlah: 0,
      nama_barang: barang?.nama_barang,
      nama_satuan: barang?.nama_satuan,
      stok_tersedia: barang?.stok_tersedia,
    };
    
    setDetails(newDetails);
    setError(null); // Clear error jika berhasil
  };

  // Handle change jumlah di row tertentu
  const handleJumlahChange = (index: number, jumlah: number) => {
    const newDetails = [...details];
    const stokTersedia = newDetails[index].stok_tersedia || 0;
    
    // Validasi: jumlah tidak boleh negatif
    if (jumlah < 0) {
      setError('Jumlah tidak boleh negatif');
      return;
    }
    
    // Validasi: jumlah tidak boleh > stok
    if (jumlah > stokTersedia) {
      setError(`Jumlah melebihi stok tersedia (${stokTersedia})`);
      return;
    }
    
    newDetails[index].jumlah = jumlah;
    setDetails(newDetails);
    setError(null);
  };

  // Tambah row detail baru
  const addDetailRow = () => {
    setDetails([...details, { idbarang: 0, jumlah: 0 }]);
  };

  // Hapus row detail
  const removeDetailRow = (index: number) => {
    if (details.length > 1) {
      const newDetails = details.filter((_, i) => i !== index);
      setDetails(newDetails);
      setError(null); // Clear error saat hapus row
    }
  };

  // Submit penjualan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validasi
    if (!selectedMargin) {
      setError('Pilih margin penjualan');
      return;
    }

    // Validasi PPN (0-100%)
    if (ppn < 0 || ppn > 100) {
      setError('PPN harus antara 0% - 100%');
      return;
    }

    // Filter details yang valid (idbarang > 0 dan jumlah > 0)
    const validDetails = details.filter(d => d.idbarang > 0 && d.jumlah > 0);
    
    if (validDetails.length === 0) {
      setError('Minimal harus ada 1 detail barang yang valid');
      return;
    }

    // Validasi: cek duplikasi barang
    const barangIds = validDetails.map(d => d.idbarang);
    const hasDuplicate = barangIds.some((id, index) => barangIds.indexOf(id) !== index);
    if (hasDuplicate) {
      setError('Terdapat barang yang sama di beberapa baris. Setiap barang hanya boleh dipilih sekali.');
      return;
    }

    // Check stok untuk semua detail
    for (const detail of validDetails) {
      const barang = barangList.find(b => b.idbarang === detail.idbarang);
      if (!barang) {
        setError(`Barang ID ${detail.idbarang} tidak ditemukan`);
        return;
      }
      if (detail.jumlah > barang.stok_tersedia) {
        setError(`Stok ${barang.nama_barang} tidak mencukupi. Tersedia: ${barang.stok_tersedia}`);
        return;
      }
      if (detail.jumlah <= 0) {
        setError(`Jumlah untuk ${barang.nama_barang} harus lebih dari 0`);
        return;
      }
    }

    // Show confirmation dialog
    setShowConfirm(true);
  };

  // Actual submission after confirmation
  const confirmSubmit = async () => {
    setShowConfirm(false);
    
    const validDetails = details.filter(d => d.idbarang > 0 && d.jumlah > 0);

    try {
      setLoading(true);

      const payload = {
        idmargin_penjualan: selectedMargin,
        iduser: iduser,
        ppn: ppn,  // PPN dalam persen
        details: validDetails.map(d => ({
          idbarang: d.idbarang,
          jumlah: d.jumlah,
        })),
      };

      console.log('Sending POST /api/penjualans:', payload);

      const res = await fetch('/api/penjualans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log('Response:', result);

      // Check HTTP status dan response status
      if (res.ok && result.status === 201 && result.data) {
        alert(`Penjualan berhasil dibuat! ID: ${result.data.idpenjualan}`);
        router.push('/penjualan');
      } else {
        setError(result.error || 'Gagal membuat penjualan');
      }
    } catch (err) {
      setError('Error membuat penjualan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-blue-200 border-2 border-black p-4">
        <h1 className="text-xl font-bold uppercase text-black">Tambah Penjualan</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border-2 border-red-500 text-red-700">
          {error}
        </div>
      )}

      {/* Loading state saat fetch data */}
      {loading && barangList.length === 0 && (
        <div className="p-4 bg-blue-100 border-2 border-blue-500 text-blue-700">
          Memuat data barang dan margin...
        </div>
      )}

      {/* Warning jika tidak ada barang tersedia */}
      {!loading && barangList.length === 0 && (
        <div className="p-4 bg-yellow-100 border-2 border-yellow-500 text-yellow-700">
          Tidak ada barang dengan stok tersedia. Silakan lakukan penerimaan barang terlebih dahulu.
        </div>
      )}

      {/* Warning jika tidak ada margin aktif */}
      {!loading && marginList.length === 0 && (
        <div className="p-4 bg-yellow-100 border-2 border-yellow-500 text-yellow-700">
          Tidak ada margin penjualan aktif. Silakan tambahkan margin terlebih dahulu.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white border-2 border-black p-6 space-y-6">
          <h2 className="text-lg font-bold uppercase text-black">Info Penjualan</h2>
          
          {/* Margin Penjualan */}
          <div className="p-4 border-2 border-gray-300 rounded">
            <label className="block text-sm font-bold uppercase text-black mb-2">
              Margin Penjualan *
            </label>
            <select
              value={selectedMargin?.toString() || ''}
              onChange={(e) => setSelectedMargin(Number(e.target.value))}
              className="w-full p-3 border-2 border-black"
              required
            >
              <option value="">-- Pilih Margin --</option>
              {marginList.map(m => (
                <option key={m.idmargin_penjualan} value={m.idmargin_penjualan}>
                  {m.persen}% Margin
                </option>
              ))}
            </select>
          </div>

          {/* PPN */}
          <div className="p-4 border-2 border-gray-300 rounded">
            <label className="block text-sm font-bold uppercase text-black mb-2">
              PPN (%) *
            </label>
            <input
              type="number"
              value={ppn}
              onChange={(e) => setPpn(Number(e.target.value))}
              placeholder="Masukkan persentase PPN (misal: 11 untuk 11%)"
              min={0}
              max={100}
              step={0.01}
              className="w-full p-3 border-2 border-black"
              required
            />
            <p className="text-xs text-gray-600 mt-2">
              Masukkan persentase PPN (0-100). Misal: 11 untuk PPN 11%. Nilai PPN akan dihitung otomatis dari subtotal.
            </p>
          </div>

          {/* Detail Barang */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-bold uppercase text-black">Detail Barang</h3>
              <Button
                type="button"
                onClick={addDetailRow}
                variant="primary"
                disabled={loading}
              >
                + Tambah Baris
              </Button>
            </div>

            {/* Tabel Detail Barang */}
            <div className="overflow-x-auto">
              <table className="w-full border-2 border-black">
                <thead className="bg-gray-200 border-b-2 border-black">
                  <tr>
                    <th className="p-3 text-left font-bold border-r-2 border-black">Barang</th>
                    <th className="p-3 text-center font-bold border-r-2 border-black">Stok</th>
                    <th className="p-3 text-center font-bold border-r-2 border-black">Jumlah</th>
                    <th className="p-3 text-center font-bold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((detail, index) => (
                    <tr key={index} className="border-b-2 border-black hover:bg-blue-50">
                      <td className="p-3 border-r-2 border-black">
                        <select
                          value={detail.idbarang}
                          onChange={(e) => handleBarangChange(index, Number(e.target.value))}
                          className="w-full p-2 border-2 border-black"
                          required
                        >
                          <option value={0}>-- Pilih Barang --</option>
                          {barangList.map((barang) => (
                            <option key={barang.idbarang} value={barang.idbarang}>
                              {barang.nama_barang} ({barang.nama_satuan})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3 text-center border-r-2 border-black">
                        <input
                          type="text"
                          value={detail.stok_tersedia || 0}
                          disabled
                          className="w-20 p-2 border-2 border-black text-center bg-gray-100"
                        />
                      </td>
                      <td className="p-3 text-center border-r-2 border-black">
                        <input
                          type="number"
                          value={detail.jumlah}
                          onChange={(e) => handleJumlahChange(index, Number(e.target.value))}
                          min={0}
                          max={detail.stok_tersedia || 0}
                          step={1}
                          className="w-20 p-2 border-2 border-black text-center"
                          required
                          disabled={!detail.idbarang}
                        />
                      </td>
                      <td className="p-3 text-center">
                        {details.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDetailRow(index)}
                            className="px-3 py-1 bg-red-500 text-white border-2 border-black hover:bg-red-600"
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

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/penjualan')}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || barangList.length === 0 || marginList.length === 0}
            >
              {loading ? 'Menyimpan...' : 'Simpan Penjualan'}
            </Button>
          </div>
        </div>
      </form>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        title="Konfirmasi Transaksi Penjualan"
        message={`Apakah Anda yakin ingin menyimpan transaksi penjualan ini?\n\n${details.filter(d => d.idbarang > 0 && d.jumlah > 0).length} item akan dijual.\n\nTransaksi yang sudah disimpan TIDAK DAPAT DIEDIT atau DIHAPUS.`}
        confirmText="Ya, Simpan"
        cancelText="Periksa Kembali"
        onConfirm={confirmSubmit}
        onCancel={() => setShowConfirm(false)}
        variant="info"
      />
    </div>
  );
}
