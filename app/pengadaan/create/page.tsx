'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/Button';
import Link from 'next/link';
import { Vendor, Barang } from '@/app/lib/type';

interface DetailItem {
  idbarang: number;
  nama_barang: string;
  jumlah: number;
  harga_satuan: number;
  sub_total: number;
}

export default function TambahPengadaan() {
  const router = useRouter();
  
  // State
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [barangs, setBarangs] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [selectedVendor, setSelectedVendor] = useState<number>(0);
  const [ppnPersen, setPpnPersen] = useState<number>(10);  // Default 10%
  const [details, setDetails] = useState<DetailItem[]>([]);
  
  // Item entry state
  const [selectedBarang, setSelectedBarang] = useState<number>(0);
  const [jumlah, setJumlah] = useState<number>(0);
  const [hargaSatuan, setHargaSatuan] = useState<number>(0);

  // Fetch vendors dan barangs saat component mount
  useEffect(() => {
    fetchVendors();
    fetchBarangs();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await fetch('/api/vendors?filter=aktif');
      const data = await res.json();
      if (Array.isArray(data)) {
        setVendors(data);
      }
    } catch (error) {
      alert('Failed to load vendors');
    }
  };

  const fetchBarangs = async () => {
    try {
      const res = await fetch('/api/barangs?filter=aktif');
      const data = await res.json();
      if (Array.isArray(data)) {
        setBarangs(data);
      }
    } catch (error) {
      alert('Failed to load barangs');
    }
  };

  // Add item to detail list
  const handleAddItem = () => {
    if (selectedBarang === 0) {
      alert('Pilih barang terlebih dahulu');
      return;
    }
    if (jumlah <= 0) {
      alert('Jumlah harus lebih dari 0');
      return;
    }
    if (hargaSatuan <= 0) {
      alert('Harga satuan harus lebih dari 0');
      return;
    }

    const barang = barangs.find(b => b.idbarang === selectedBarang);
    if (!barang) return;

    // Cek apakah barang sudah ada di list
    const exists = details.find(d => d.idbarang === selectedBarang);
    if (exists) {
      alert('Barang sudah ada dalam daftar. Edit atau hapus terlebih dahulu.');
      return;
    }

    const newItem: DetailItem = {
      idbarang: selectedBarang,
      nama_barang: barang.nama,
      jumlah: jumlah,
      harga_satuan: hargaSatuan,
      sub_total: jumlah * hargaSatuan
    };

    setDetails([...details, newItem]);

    // Reset form
    setSelectedBarang(0);
    setJumlah(0);
    setHargaSatuan(0);
  };

  // Remove item from detail list
  const handleRemoveItem = (idbarang: number) => {
    setDetails(details.filter(d => d.idbarang !== idbarang));
  };

  // Calculate totals (untuk display/preview saja, nilai final dihitung database!)
  const subtotalNilai = details.reduce((sum, item) => sum + item.sub_total, 0);
  const ppnNilai = subtotalNilai * (ppnPersen / 100);  // Hitung PPN berdasarkan persen
  const totalNilai = subtotalNilai + ppnNilai;

  // Submit pengadaan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedVendor === 0) {
      alert('Pilih vendor terlebih dahulu');
      return;
    }
    
    if (ppnPersen < 0) {
      alert('PPN tidak boleh negatif');
      return;
    }

    if (details.length === 0) {
      alert('Tambahkan minimal 1 barang');
      return;
    }

    setLoading(true);

    try {
      // ============================================
      // Hitung PPN di frontend (subtotal × persen)
      // Kirim nilai RUPIAH ke backend (bukan persen!)
      // ============================================
      const calculatedSubtotal = details.reduce((sum, item) => sum + item.sub_total, 0);
      const calculatedPpnNilai = calculatedSubtotal * (ppnPersen / 100);
      
      const payload = {
        user_iduser: 1, // TODO: Get from session/auth
        vendor_idvendor: selectedVendor,
        ppn_nilai: calculatedPpnNilai,  // Kirim nilai RUPIAH (bukan persen!)
        details: details.map(d => ({
          idbarang: d.idbarang,
          jumlah: d.jumlah,
          harga_satuan: d.harga_satuan
        }))
      };

      const response = await fetch('/api/pengadaans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      if (response.ok) {
        alert('Pengadaan berhasil dibuat!');
        router.push('/pengadaan');
      } else {
        console.error('Error response:', result);
        alert(`Error: ${result.error || 'Failed to create pengadaan'}`);
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-green-200 border-2 border-black p-4">
        <h1 className="text-xl font-bold uppercase text-black">Tambah Pengadaan</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vendor Selection */}
        <div className="bg-white border-2 border-black p-6">
          <h2 className="text-lg font-bold mb-4 uppercase">Informasi Pengadaan</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-bold uppercase">
                Vendor <span className="text-red-600">*</span>
              </label>
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(parseInt(e.target.value))}
                className="w-full p-3 border-2 border-black bg-white"
                required
              >
                <option value={0}>-- Pilih Vendor --</option>
                {vendors.map(v => (
                  <option key={v.idvendor} value={v.idvendor}>
                    {v.nama_vendor}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-bold uppercase">
                PPN (%) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                value={ppnPersen}
                onChange={(e) => setPpnPersen(parseFloat(e.target.value) || 0)}
                className="w-full p-3 border-2 border-black"
                placeholder="Contoh: 10 untuk 10%, 11 untuk 11%"
                step="0.01"
                min="0"
                max="100"
                required
              />
              <p className="text-sm text-gray-600 mt-1">
                Masukkan angka persen (contoh: 10 untuk PPN 10%, 11 untuk PPN 11%)
              </p>
            </div>
          </div>
        </div>

        {/* Add Item Form */}
        <div className="bg-white border-2 border-black p-6">
          <h2 className="text-lg font-bold mb-4 uppercase">Tambah Barang</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <label className="block mb-2 text-sm font-bold">Barang</label>
              <select
                value={selectedBarang}
                onChange={(e) => {
                  const id = parseInt(e.target.value);
                  setSelectedBarang(id);
                  // Auto-fill harga dari database
                  const barang = barangs.find(b => b.idbarang === id);
                  if (barang) {
                    setHargaSatuan(parseFloat(barang.harga));
                  }
                }}
                className="w-full p-3 border-2 border-black bg-white"
              >
                <option value={0}>-- Pilih Barang --</option>
                {barangs.map(b => (
                  <option key={b.idbarang} value={b.idbarang}>
                    {b.nama}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-1">
              <label className="block mb-2 text-sm font-bold">Jumlah</label>
              <input
                type="number"
                value={jumlah || ''}
                onChange={(e) => setJumlah(parseInt(e.target.value) || 0)}
                className="w-full p-3 border-2 border-black"
                placeholder="0"
                min="1"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block mb-2 text-sm font-bold">Harga Satuan</label>
              <input
                type="number"
                value={hargaSatuan || ''}
                onChange={(e) => setHargaSatuan(parseInt(e.target.value) || 0)}
                className="w-full p-3 border-2 border-black"
                placeholder="0"
                min="0"
              />
            </div>

            <div className="md:col-span-1 flex items-end">
              <Button
                type="button"
                onClick={handleAddItem}
                variant="primary"
                size="medium"
                className="w-full"
              >
                + Tambah
              </Button>
            </div>
          </div>
        </div>

        {/* Detail Items Table */}
        {details.length > 0 && (
          <div className="bg-white border-2 border-black p-6">
            <h2 className="text-lg font-bold mb-4 uppercase">Daftar Barang</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-2 border-black">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border-2 border-black p-3 text-left font-bold uppercase text-sm">Barang</th>
                    <th className="border-2 border-black p-3 text-right font-bold uppercase text-sm">Jumlah</th>
                    <th className="border-2 border-black p-3 text-right font-bold uppercase text-sm">Harga Satuan</th>
                    <th className="border-2 border-black p-3 text-right font-bold uppercase text-sm">Subtotal</th>
                    <th className="border-2 border-black p-3 text-center font-bold uppercase text-sm">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((item) => (
                    <tr key={item.idbarang} className="hover:bg-gray-50">
                      <td className="border-2 border-black p-3">{item.nama_barang}</td>
                      <td className="border-2 border-black p-3 text-right">{item.jumlah}</td>
                      <td className="border-2 border-black p-3 text-right">
                        Rp {item.harga_satuan.toLocaleString('id-ID')}
                      </td>
                      <td className="border-2 border-black p-3 text-right font-bold">
                        Rp {item.sub_total.toLocaleString('id-ID')}
                      </td>
                      <td className="border-2 border-black p-3 text-center">
                        <Button
                          type="button"
                          onClick={() => handleRemoveItem(item.idbarang)}
                          variant="danger"
                          size="small"
                        >
                          Hapus
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-yellow-100 font-bold">
                  <tr>
                    <td colSpan={3} className="border-2 border-black p-3 text-right uppercase">
                      Subtotal:
                    </td>
                    <td className="border-2 border-black p-3 text-right">
                      Rp {subtotalNilai.toLocaleString('id-ID')}
                    </td>
                    <td className="border-2 border-black"></td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="border-2 border-black p-3 text-right uppercase">
                      PPN ({ppnPersen}%):
                    </td>
                    <td className="border-2 border-black p-3 text-right">
                      Rp {ppnNilai.toLocaleString('id-ID')}
                    </td>
                    <td className="border-2 border-black"></td>
                  </tr>
                  <tr className="bg-yellow-200">
                    <td colSpan={3} className="border-2 border-black p-3 text-right uppercase text-lg">
                      Total:
                    </td>
                    <td className="border-2 border-black p-3 text-right text-lg">
                      Rp {totalNilai.toLocaleString('id-ID')}
                    </td>
                    <td className="border-2 border-black"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-300">
              <p className="text-sm text-blue-800">
                ℹ️ <strong>Catatan:</strong> Total yang ditampilkan di atas adalah estimasi.
                Total final akan dihitung otomatis oleh sistem saat pengadaan disimpan.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white border-2 border-black p-6">
          <div className="flex gap-4 justify-end">
            <Link href="/pengadaan">
              <Button type="button" variant="secondary" size="medium">
                Batal
              </Button>
            </Link>
            <Button
              type="submit"
              variant="success"
              size="medium"
              disabled={loading || details.length === 0}
            >
              {loading ? 'Menyimpan...' : 'Simpan Pengadaan'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
