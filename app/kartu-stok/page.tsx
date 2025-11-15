'use client';

import { useEffect, useState } from 'react';
import { Table } from '@/app/components/Table';

interface KartuStokDetail {
  idkartu_stok: number;
  idtransaksi: number;
  idbarang: number;
  nama_barang: string;
  nama_satuan: string;
  jenis_transaksi: string;
  jenis_text: string;
  masuk: number;
  keluar: number;
  current_stock: number;
  created_at: string;
}

export default function KartuStokPage() {
  const [kartuStok, setKartuStok] = useState<KartuStokDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchKartuStok();
  }, []);

  const fetchKartuStok = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/kartu-stok?limit=100');
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setKartuStok(data);
      } else {
        setError('Failed to fetch kartu stok');
      }
    } catch (err) {
      setError('Error fetching kartu stok');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    alert('Delete tidak tersedia untuk kartu stok (auto-generated dari trigger)');
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  const columns = [
    { key: 'idkartu_stok', label: 'ID' },
    { key: 'created_at', label: 'Tanggal' },
    { key: 'nama_barang', label: 'Barang' },
    { key: 'nama_satuan', label: 'Satuan' },
    { key: 'jenis_text', label: 'Transaksi' },
    { key: 'masuk', label: 'Masuk' },
    { key: 'keluar', label: 'Keluar' },
    { key: 'current_stock', label: 'Stock' },
  ];

  const displayData = kartuStok.map(k => ({
    ...k,
    created_at: new Date(k.created_at).toLocaleString('id-ID'),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00A69F] to-[#0D9488] rounded-2xl shadow-lg p-8 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Kartu Stok</h1>
            <p className="text-teal-100 mt-1">Riwayat pergerakan stok barang secara detail</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#00A69F]/10 rounded-lg">
            <svg className="w-5 h-5 text-[#00A69F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Records</p>
            <p className="text-xl font-bold text-gray-800">{kartuStok.length}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        data={displayData}
        columns={columns}
        onDelete={handleDelete}
        editPath="/kartu-stok/detail"
        idKey="idkartu_stok"
      />
    </div>
  );
}

