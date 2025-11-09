'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApiResponse, Pengadaan } from '@/app/lib/type';
import { Button } from '@/app/components/Button';

interface DetailBreakdown {
  iddetail_pengadaan: number;
  idbarang: number;
  nama_barang: string;
  nama_satuan: string;
  harga_satuan: number;
  jumlah_dipesan: number;
  jumlah_sudah_diterima: number;
  sisa_diterima: number;
  sub_total: number;
}

interface DetailInput {
  idbarang: number;
  jumlah_terima: number;
  harga_satuan_terima: number;
  nama_barang?: string;
}

export default function AddPenerimaanPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1); // STEP 1: Pilih pengadaan, STEP 2: Input detail
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // STEP 1 - Pilih Pengadaan
  const [pengadaans, setPengadaans] = useState<Pengadaan[]>([]);
  const [selectedPengadaan, setSelectedPengadaan] = useState<number | null>(null);
  
  // STEP 2 - Input Detail Penerimaan
  const [breakdown, setBreakdown] = useState<DetailBreakdown[]>([]);
  const [details, setDetails] = useState<DetailInput[]>([]);
  const [iduser, setIduser] = useState<number | null>(null);

  useEffect(() => {
    if (step === 1) {
      fetchPengadaanBelumLengkap();
    }
  }, [step]);

  // ===== STEP 1: Fetch Pengadaan yang belum lengkap =====
  const fetchPengadaanBelumLengkap = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/penerimaans/pengadaan-belum-lengkap');
      const result: ApiResponse<any[]> = await res.json();
      if (result.status === 200 && Array.isArray(result.data)) {
        setPengadaans(result.data);
      } else {
        setError('Gagal mengambil daftar pengadaan');
      }
    } catch (err) {
      setError('Error mengambil pengadaan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ===== STEP 1 -> STEP 2: Ke halaman input detail =====
  const handleSelectPengadaan = async (idpengadaan: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch detail breakdown untuk pengadaan ini
      const res = await fetch(`/api/penerimaans/breakdown/${idpengadaan}`);
      const result: ApiResponse<DetailBreakdown[]> = await res.json();
      
      if (result.status === 200 && Array.isArray(result.data)) {
        setSelectedPengadaan(idpengadaan);
        setBreakdown(result.data);
        
        // Initialize details array
        const initialDetails = result.data.map((item: DetailBreakdown) => ({
          idbarang: item.idbarang,
          jumlah_terima: item.sisa_diterima,
          harga_satuan_terima: item.harga_satuan,
          nama_barang: item.nama_barang,
        }));
        setDetails(initialDetails);
        
        setStep(2);
      } else {
        setError(result.error || 'Gagal mengambil detail pengadaan');
      }
    } catch (err) {
      setError('Error mengambil detail');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ===== STEP 2: Update jumlah terima =====
  const handleUpdateDetail = (idbarang: number, jumlah: number) => {
    setDetails(details.map(d => 
      d.idbarang === idbarang ? { ...d, jumlah_terima: jumlah } : d
    ));
  };

  // ===== STEP 2: Submit penerimaan =====
  const handleSubmitPenerimaan = async () => {
    if (!selectedPengadaan || !iduser) {
      setError('Data tidak lengkap');
      return;
    }

    // Validasi minimal satu item diterima
    if (details.every(d => d.jumlah_terima === 0)) {
      setError('Minimal satu barang harus diterima');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/penerimaans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idpengadaan: selectedPengadaan,
          iduser: iduser,
          details: details.map(d => ({
            idbarang: d.idbarang,
            jumlah_terima: d.jumlah_terima,
            harga_satuan_terima: d.harga_satuan_terima,
          })),
        }),
      });

      const result: ApiResponse<unknown> = await res.json();
      if (result.status === 201 || result.status === 200) {
        router.push('/penerimaan');
      } else {
        setError(result.error || 'Gagal membuat penerimaan');
      }
    } catch (err) {
      setError('Error membuat penerimaan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-blue-200 border-2 border-black p-4">
        <h1 className="text-xl font-bold uppercase text-black">
          {step === 1 ? 'STEP 1: Pilih Pengadaan' : 'STEP 2: Input Detail Penerimaan'}
        </h1>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border-2 border-red-500 text-red-700">
          {error}
        </div>
      )}

      {/* ===== STEP 1: Pilih Pengadaan ===== */}
      {step === 1 && (
        <div className="bg-white border-2 border-black p-6">
          <h2 className="text-lg font-bold uppercase text-black mb-4">Daftar Pengadaan (Belum Lengkap)</h2>
          
          {loading && <p>Loading...</p>}
          
          {pengadaans.length === 0 ? (
            <p className="text-gray-600">Tidak ada pengadaan yang belum lengkap</p>
          ) : (
            <div className="space-y-3">
              {pengadaans.map((p: any) => (
                <div
                  key={p.idpengadaan}
                  className="p-4 border-2 border-gray-300 rounded cursor-pointer hover:bg-blue-50"
                  onClick={() => handleSelectPengadaan(p.idpengadaan)}
                >
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="font-bold text-sm">ID Pengadaan</p>
                      <p className="text-black">{p.idpengadaan}</p>
                    </div>
                    <div>
                      <p className="font-bold text-sm">Nomor Pengadaan</p>
                      <p className="text-black">{p.nomor_pengadaan}</p>
                    </div>
                    <div>
                      <p className="font-bold text-sm">Vendor</p>
                      <p className="text-black">{p.nama_vendor || '-'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Batal
            </Button>
          </div>
        </div>
      )}

      {/* ===== STEP 2: Input Detail Penerimaan ===== */}
      {step === 2 && (
        <div className="bg-white border-2 border-black p-6">
          <h2 className="text-lg font-bold uppercase text-black mb-4">
            Detail Barang - Pengadaan #{selectedPengadaan}
          </h2>

          {/* Input User ID */}
          <div className="mb-6 p-4 border-2 border-gray-300 rounded">
            <label className="block text-sm font-bold uppercase text-black mb-2">
              ID User (Penerima)
            </label>
            <input
              type="number"
              value={iduser || ''}
              onChange={(e) => setIduser(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full p-3 border-2 border-black"
              placeholder="Masukkan ID User Penerima"
              required
            />
          </div>

          {/* Tabel Detail Barang */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-2 border-black">
              <thead className="bg-gray-200 border-b-2 border-black">
                <tr>
                  <th className="p-3 text-left font-bold border-r-2 border-black">Barang</th>
                  <th className="p-3 text-left font-bold border-r-2 border-black">Satuan</th>
                  <th className="p-3 text-right font-bold border-r-2 border-black">Dipesan</th>
                  <th className="p-3 text-right font-bold border-r-2 border-black">Sudah Terima</th>
                  <th className="p-3 text-right font-bold border-r-2 border-black">Sisa</th>
                  <th className="p-3 text-right font-bold">Terima Kali Ini</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.map((item, idx) => (
                  <tr key={idx} className="border-b-2 border-black hover:bg-blue-50">
                    <td className="p-3 border-r-2 border-black">{item.nama_barang}</td>
                    <td className="p-3 border-r-2 border-black">{item.nama_satuan}</td>
                    <td className="p-3 text-right border-r-2 border-black">{item.jumlah_dipesan}</td>
                    <td className="p-3 text-right border-r-2 border-black">{item.jumlah_sudah_diterima}</td>
                    <td className="p-3 text-right border-r-2 border-black">{item.sisa_diterima}</td>
                    <td className="p-3 text-right">
                      <input
                        type="number"
                        min="0"
                        max={item.sisa_diterima}
                        value={details[idx]?.jumlah_terima || 0}
                        onChange={(e) => handleUpdateDetail(item.idbarang, parseInt(e.target.value) || 0)}
                        className="w-20 p-2 border-2 border-black text-right"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Kembali
            </Button>
            <Button
              type="submit"
              variant="primary"
              onClick={handleSubmitPenerimaan}
              disabled={loading || !iduser}
            >
              {loading ? 'Processing...' : 'Simpan Penerimaan'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

