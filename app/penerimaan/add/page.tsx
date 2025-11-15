'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApiResponse, Pengadaan } from '@/app/lib/type';
import { Button } from '@/app/components/Button';
import { Card } from '@/app/components/Card';
import { FormInput } from '@/app/components/FormInput';
import { Toast } from '@/app/components/Toast';
import { useToast } from '@/app/hooks/useToast';
import { formatCurrency } from '@/app/lib/utils/format';

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
  const { toast, hideToast, success, error: showError, warning } = useToast();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // STEP 1 - Pilih Pengadaan
  const [pengadaans, setPengadaans] = useState<any[]>([]);
  const [filteredPengadaans, setFilteredPengadaans] = useState<any[]>([]);
  const [selectedPengadaan, setSelectedPengadaan] = useState<number | null>(null);
  
  // Search & Filter
  const [searchId, setSearchId] = useState('');
  const [searchVendor, setSearchVendor] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // STEP 2 - Input Detail Penerimaan
  const [breakdown, setBreakdown] = useState<DetailBreakdown[]>([]);
  const [details, setDetails] = useState<DetailInput[]>([]);
  const [iduser, setIduser] = useState<number | null>(null);

  useEffect(() => {
    if (step === 1) {
      fetchPengadaanBelumLengkap();
    }
  }, [step]);

  // Filter pengadaan berdasarkan search dan filter
  useEffect(() => {
    let filtered = [...pengadaans];

    // Filter by ID
    if (searchId.trim()) {
      filtered = filtered.filter(p => 
        p.idpengadaan.toString().includes(searchId.trim())
      );
    }

    // Filter by Vendor
    if (searchVendor.trim()) {
      filtered = filtered.filter(p => 
        p.nama_vendor?.toLowerCase().includes(searchVendor.toLowerCase())
      );
    }

    // Filter by Status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    setFilteredPengadaans(filtered);
  }, [pengadaans, searchId, searchVendor, filterStatus]);

  // ===== STEP 1: Fetch Pengadaan yang belum lengkap =====
  const fetchPengadaanBelumLengkap = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/penerimaans/pengadaan-belum-lengkap');
      const result: ApiResponse<any[]> = await res.json();
      console.log(result);
      if (result.status === 200 && Array.isArray(result.data)) {
        setPengadaans(result.data);
        setFilteredPengadaans(result.data);
      } else {
        showError('Gagal mengambil daftar pengadaan');
      }
    } catch (err) {
      showError('Error mengambil pengadaan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchId('');
    setSearchVendor('');
    setFilterStatus('all');
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
        showError(result.error || 'Gagal mengambil detail pengadaan');
      }
    } catch (err) {
      showError('Error mengambil detail');
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
      warning('Data tidak lengkap. Harap isi ID User dan pilih barang.');
      return;
    }

    // Filter hanya barang yang diterima (jumlah_terima > 0)
    const filteredDetails = details.filter(d => d.jumlah_terima > 0);

    // Validasi minimal satu item diterima
    if (filteredDetails.length === 0) {
      warning('Minimal satu barang harus diterima');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        idpengadaan: selectedPengadaan,
        iduser: iduser,
        details: filteredDetails.map(d => ({
          idbarang: Number(d.idbarang),
          jumlah_terima: Number(d.jumlah_terima),
          harga_satuan_terima: Number(d.harga_satuan_terima),
        })),
      };

      console.log('Payload to send:', JSON.stringify(payload, null, 2));

      const res = await fetch('/api/penerimaans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result: ApiResponse<unknown> = await res.json();
      if (result.status === 201 || result.status === 200) {
        success('Penerimaan berhasil disimpan!');
        setTimeout(() => router.push('/penerimaan'), 1500);
      } else {
        showError(result.error || 'Gagal membuat penerimaan');
      }
    } catch (err) {
      showError('Error membuat penerimaan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00A69F] to-[#0D9488] rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {step === 1 ? 'Pilih Pengadaan' : 'Input Detail Penerimaan'}
              </h1>
              <p className="text-teal-100 mt-1">
                {step === 1 
                  ? 'Langkah 1 dari 2: Pilih pengadaan yang akan diterima barangnya' 
                  : `Langkah 2 dari 2: Tentukan jumlah barang untuk Pengadaan #${selectedPengadaan}`
                }
              </p>
            </div>
          </div>
          {/* Progress Indicator */}
          <div className="hidden md:flex items-center gap-2">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step === 1 ? 'bg-white text-[#00A69F]' : 'bg-white/30 text-white'} font-bold`}>
              1
            </div>
            <div className="w-12 h-1 bg-white/30"></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step === 2 ? 'bg-white text-[#00A69F]' : 'bg-white/30 text-white'} font-bold`}>
              2
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="bg-red-50 border-red-200">
          <div className="p-4 text-red-700 flex items-center gap-3">
            <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        </Card>
      )}

      {/* ===== STEP 1: Pilih Pengadaan ===== */}
      {step === 1 && (
        <>
          {/* Search & Filter Section */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-[#00A69F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h2 className="text-lg font-bold text-gray-900">Cari & Filter Pengadaan</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search by ID */}
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

              {/* Search by Vendor */}
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

              {/* Filter by Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#00A69F] focus:outline-none transition-colors"
                >
                  <option value="all">Semua Status</option>
                  <option value="P">Diproses</option>
                  <option value="S">Sebagian Diterima</option>
                </select>
              </div>
            </div>

            {/* Reset & Info */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Menampilkan <span className="font-bold text-[#00A69F]">{filteredPengadaans.length}</span> dari {pengadaans.length} pengadaan
              </div>
              {(searchId || searchVendor || filterStatus !== 'all') && (
                <button
                  onClick={handleResetFilters}
                  className="text-sm text-gray-600 hover:text-[#00A69F] font-medium transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reset Filter
                </button>
              )}
            </div>
          </Card>

          {/* List Pengadaan */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Daftar Pengadaan (Belum Lengkap)</h2>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#00A69F] mb-4"></div>
                <p className="text-gray-500">Memuat data pengadaan...</p>
              </div>
            ) : filteredPengadaans.length === 0 ? (
              <div className="text-center py-16">
                <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 text-lg mb-2">
                  {pengadaans.length === 0 ? 'Tidak ada pengadaan yang belum lengkap' : 'Tidak ada hasil yang cocok'}
                </p>
                {pengadaans.length > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[#00A69F] hover:underline text-sm mt-2"
                  >
                    Reset pencarian
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPengadaans.map((p: any) => (
                  <div
                    key={p.idpengadaan}
                    onClick={() => handleSelectPengadaan(p.idpengadaan)}
                    className="group p-6 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#00A69F] hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {/* ID Pengadaan */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">ID Pengadaan</p>
                        <p className="text-xl font-bold text-[#00A69F] group-hover:text-[#0D9488]">
                          #{p.idpengadaan}
                        </p>
                      </div>
                      
                      {/* Vendor */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Vendor</p>
                        <p className="font-semibold text-gray-900">{p.nama_vendor || '-'}</p>
                      </div>
                      
                      {/* Status */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          p.status === 'P' 
                            ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                            : p.status === 'S' 
                            ? 'bg-amber-100 text-amber-700 border border-amber-300'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {p.status === 'P' ? 'Diproses' : p.status === 'S' ? 'Sebagian Diterima' : (p.status_text || p.status)}
                        </span>
                      </div>
                      
                      {/* Progress */}
                      <div>
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Progress Penerimaan</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-[#00A69F] h-2 rounded-full transition-all"
                              style={{ width: `${(p.items_lengkap / p.total_items) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                            {p.items_lengkap || 0}/{p.total_items || 0}
                          </span>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="flex items-center justify-end">
                        <div className="flex items-center gap-2 text-[#00A69F] group-hover:text-[#0D9488] font-medium">
                          <span>Pilih</span>
                          <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-3 mt-6 pt-6 border-t">
              <Button type="button" variant="secondary" onClick={() => router.back()}>
                ← Batal
              </Button>
            </div>
          </Card>
        </>
      )}

      {/* ===== STEP 2: Input Detail Penerimaan ===== */}
      {step === 2 && (
        <>
          {/* User Input Section */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-[#00A69F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h2 className="text-lg font-bold text-gray-900">Informasi Penerima</h2>
            </div>
            
            <FormInput
              label="ID User (Penerima)"
              type="number"
              value={iduser?.toString() || ''}
              onChange={(e) => setIduser(e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Masukkan ID User yang menerima barang"
              required
              helper="ID user yang bertanggung jawab menerima barang ini"
            />
          </Card>

          {/* Items Table Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Detail Barang yang Diterima</h2>
                <p className="text-sm text-gray-600 mt-1">Tentukan jumlah barang yang diterima untuk setiap item</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Item</p>
                <p className="text-2xl font-bold text-[#00A69F]">{breakdown.length}</p>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b">Nama Barang</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700 border-b">Satuan</th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-700 border-b">Harga Satuan</th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-700 border-b">Qty Dipesan</th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-700 border-b">Sudah Terima</th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-700 border-b">Sisa</th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700 border-b bg-teal-50">Terima Kali Ini</th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-700 border-b bg-teal-50">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdown.map((item, idx) => {
                    const currentDetail = details[idx];
                    const subtotal = (currentDetail?.jumlah_terima || 0) * item.harga_satuan;
                    const isReceiving = currentDetail?.jumlah_terima > 0;
                    
                    return (
                      <tr 
                        key={idx} 
                        className={`border-b hover:bg-gray-50 transition-colors ${isReceiving ? 'bg-teal-50/30' : ''}`}
                      >
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{item.nama_barang}</div>
                        </td>
                        <td className="p-4 text-gray-700">{item.nama_satuan}</td>
                        <td className="p-4 text-right text-gray-700">{formatCurrency(item.harga_satuan)}</td>
                        <td className="p-4 text-right">
                          <span className="font-semibold text-gray-900">{item.jumlah_dipesan}</span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-blue-600 font-medium">{item.jumlah_sudah_diterima}</span>
                        </td>
                        <td className="p-4 text-right">
                          <span className={`font-bold ${item.sisa_diterima > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                            {item.sisa_diterima}
                          </span>
                        </td>
                        <td className="p-4 bg-teal-50">
                          <div className="flex justify-center">
                            <input
                              type="number"
                              min="0"
                              max={item.sisa_diterima}
                              value={currentDetail?.jumlah_terima || 0}
                              onChange={(e) => handleUpdateDetail(item.idbarang, parseInt(e.target.value) || 0)}
                              className="w-24 px-3 py-2 border-2 border-gray-300 rounded-lg text-right focus:border-[#00A69F] focus:outline-none font-semibold"
                            />
                          </div>
                        </td>
                        <td className="p-4 text-right bg-teal-50">
                          {subtotal > 0 ? (
                            <span className="font-bold text-[#00A69F]">{formatCurrency(subtotal)}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Summary Section */}
          <Card className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 border-2 border-[#00A69F]/20">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#00A69F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Ringkasan Penerimaan
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Total Item */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Total Item Dipilih</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {details.filter(d => d.jumlah_terima > 0).length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">dari {breakdown.length} item</p>
                </div>

                {/* Total Quantity */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-gray-600 mb-1">Total Kuantitas</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {details.reduce((sum, d) => sum + (d.jumlah_terima || 0), 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">unit barang</p>
                </div>

                {/* Estimasi Total Nilai */}
                <div className="bg-white rounded-xl p-4 shadow-sm md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Estimasi Total Nilai</p>
                  <p className="text-3xl font-bold text-[#00A69F]">
                    {formatCurrency(
                      breakdown.reduce((sum, item, idx) => {
                        return sum + ((details[idx]?.jumlah_terima || 0) * item.harga_satuan);
                      }, 0)
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">total nilai penerimaan</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <Card className="p-6">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(1)}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Kembali
              </Button>
              <Button
                type="submit"
                variant="primary"
                onClick={handleSubmitPenerimaan}
                disabled={loading || !iduser || details.filter(d => d.jumlah_terima > 0).length === 0}
                className="flex-1 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Simpan Penerimaan</span>
                  </>
                )}
              </Button>
            </div>
            {!iduser && (
              <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Harap isi ID User terlebih dahulu
              </p>
            )}
          </Card>
        </>
      )}

      {/* Toast Notification */}
      <Toast 
        isOpen={toast.isOpen} 
        message={toast.message} 
        variant={toast.variant} 
        onClose={hideToast} 
      />
    </div>
  );
}

