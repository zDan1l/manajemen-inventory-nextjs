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
      <div className="bg-green-200 border-2 border-black p-4">
        <h1 className="text-xl font-bold uppercase text-black">Kartu Stok</h1>
        <p className="text-sm text-gray-700 mt-1">History Transaksi Stok Barang</p>
      </div>

      {/* Info */}
      <div className="bg-white border-2 border-black p-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-bold">Total Records:</span>
          <span>{kartuStok.length}</span>
          <span className="mx-2">|</span>
          <span className="font-bold">Jenis:</span>
          <span className="px-2 py-1 bg-green-100 border border-green-300 text-green-800 text-xs font-bold">M = Masuk (Penerimaan)</span>
          <span className="px-2 py-1 bg-red-100 border border-red-300 text-red-800 text-xs font-bold">K = Keluar (Penjualan)</span>
          <span className="px-2 py-1 bg-blue-100 border border-blue-300 text-blue-800 text-xs font-bold">R = Retur</span>
        </div>
      </div>

      {/* Table */}
      <Table
        data={displayData}
        columns={columns}
        onDelete={handleDelete}
        editPath="/kartu-stok/detail"
        idKey="idkartu_stok"
        variant="green"
      />
    </div>
  );
}

