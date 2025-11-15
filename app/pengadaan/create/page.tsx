'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/Button';
import { LinkButton } from '@/app/components/LinkButton';
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from '@/app/components/Card';
import { SelectInput } from '@/app/components/SelectInput';
import { FormInput } from '@/app/components/FormInput';
import { Alert } from '@/app/components/Alert';
import { Vendor, Barang } from '@/app/lib/type';
import { formatCurrency } from '@/app/lib/utils/format';

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
  const [error, setError] = useState<string | null>(null);
  
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
      <div className="bg-gradient-to-r from-[#00A69F] to-[#0D9488] rounded-2xl shadow-lg p-8 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Tambah Pengadaan</h1>
            <p className="text-teal-100 mt-1">Buat transaksi pengadaan barang baru</p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" title="Kesalahan" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vendor Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pengadaan</CardTitle>
            <CardDescription>Pilih vendor dan atur pajak PPN</CardDescription>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <SelectInput
                label="Vendor"
                value={selectedVendor.toString()}
                onChange={(e) => setSelectedVendor(parseInt(e.target.value))}
                options={vendors.map(v => ({ value: v.idvendor, label: v.nama_vendor }))}
                placeholder="-- Pilih Vendor --"
                required
                helper="Pilih vendor pemasok barang"
              />

              <FormInput
                label="PPN (%)"
                type="number"
                value={ppnPersen.toString()}
                onChange={(e) => setPpnPersen(parseFloat(e.target.value) || 0)}
                placeholder="Contoh: 10 untuk 10%, 11 untuk 11%"
                step="0.01"
                min="0"
                max="100"
                required
                helper="Masukkan persentase PPN (contoh: 10 untuk PPN 10%)"
              />
            </div>
          </CardBody>
        </Card>

        {/* Add Item Form */}
        <Card>
          <CardHeader>
            <CardTitle>Tambah Barang</CardTitle>
            <CardDescription>Pilih barang dan masukkan jumlah serta harga</CardDescription>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <SelectInput
                  label="Barang"
                  value={selectedBarang.toString()}
                  onChange={(e) => {
                    const id = parseInt(e.target.value);
                    setSelectedBarang(id);
                    const barang = barangs.find(b => b.idbarang === id);
                    if (barang) {
                      setHargaSatuan(parseFloat(barang.harga));
                    }
                  }}
                  options={barangs.map(b => ({ value: b.idbarang, label: b.nama }))}
                  placeholder="-- Pilih Barang --"
                />
              </div>

              <div className="md:col-span-1">
                <FormInput
                  label="Jumlah"
                  type="number"
                  value={jumlah.toString()}
                  onChange={(e) => setJumlah(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  min="1"
                />
              </div>

              <div className="md:col-span-1">
                <FormInput
                  label="Harga Satuan"
                  type="number"
                  value={hargaSatuan.toString()}
                  onChange={(e) => setHargaSatuan(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="md:col-span-1 flex items-end">
                <Button
                  type="button"
                  onClick={handleAddItem}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  }
                >
                  Tambah
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Detail Items Table */}
        {details.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Daftar Barang</CardTitle>
              <CardDescription>Item yang akan dipesan dalam pengadaan ini</CardDescription>
            </CardHeader>
            <CardBody>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border-b-2 border-gray-200 p-4 text-left font-semibold text-gray-700">Barang</th>
                      <th className="border-b-2 border-gray-200 p-4 text-right font-semibold text-gray-700">Jumlah</th>
                      <th className="border-b-2 border-gray-200 p-4 text-right font-semibold text-gray-700">Harga Satuan</th>
                      <th className="border-b-2 border-gray-200 p-4 text-right font-semibold text-gray-700">Subtotal</th>
                      <th className="border-b-2 border-gray-200 p-4 text-center font-semibold text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((item) => (
                      <tr key={item.idbarang} className="hover:bg-gray-50 transition-colors">
                        <td className="border-b border-gray-200 p-4">{item.nama_barang}</td>
                        <td className="border-b border-gray-200 p-4 text-right">{item.jumlah}</td>
                        <td className="border-b border-gray-200 p-4 text-right">
                          {formatCurrency(item.harga_satuan)}
                        </td>
                        <td className="border-b border-gray-200 p-4 text-right font-semibold">
                          {formatCurrency(item.sub_total)}
                        </td>
                        <td className="border-b border-gray-200 p-4 text-center">
                          <Button
                            type="button"
                            onClick={() => handleRemoveItem(item.idbarang)}
                            variant="danger"
                            size="sm"
                          >
                            Hapus
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gradient-to-r from-[#00A69F]/10 to-[#0D9488]/10">
                    <tr>
                      <td colSpan={3} className="border-t-2 border-gray-300 p-4 text-right font-semibold text-gray-700">
                        Subtotal:
                      </td>
                      <td className="border-t-2 border-gray-300 p-4 text-right font-bold text-gray-900">
                        {formatCurrency(subtotalNilai)}
                      </td>
                      <td className="border-t-2 border-gray-300"></td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="p-4 text-right font-semibold text-gray-700">
                        PPN ({ppnPersen}%):
                      </td>
                      <td className="p-4 text-right font-bold text-gray-900">
                        {formatCurrency(ppnNilai)}
                      </td>
                      <td></td>
                    </tr>
                    <tr className="bg-gradient-to-r from-[#00A69F]/20 to-[#0D9488]/20">
                      <td colSpan={3} className="border-t-2 border-gray-300 p-4 text-right font-bold text-gray-800 text-lg">
                        Total:
                      </td>
                      <td className="border-t-2 border-gray-300 p-4 text-right font-bold text-[#00A69F] text-lg">
                        {formatCurrency(totalNilai)}
                      </td>
                      <td className="border-t-2 border-gray-300"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <Alert variant="info" title="Catatan" className="mt-6">
                Total yang ditampilkan di atas adalah estimasi. Total final akan dihitung otomatis oleh sistem saat pengadaan disimpan.
              </Alert>
            </CardBody>
          </Card>
        )}

        {/* Action Buttons */}
        <Card>
          <CardBody>
            <div className="flex gap-4 justify-end">
              <LinkButton href="/pengadaan" variant="outline" size="lg">
                Batal
              </LinkButton>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={details.length === 0}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
              >
                Simpan Pengadaan
              </Button>
            </div>
          </CardBody>
        </Card>
      </form>
    </div>
  );
}
