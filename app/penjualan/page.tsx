// app/penjualan/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { ApiResponse, Penjualan } from '@/app/lib/type';
import { LinkButton } from '@/app/components/LinkButton';
import { Table } from '@/app/components/Table';
import { useRouter } from 'next/navigation';

export default function PenjualanPage() {
  const router = useRouter();
  const [penjualans, setPenjualans] = useState<Penjualan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPenjualans();
  }, []);

  const fetchPenjualans = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/penjualans');
      const result: ApiResponse<Penjualan[]> = await res.json();
      
      if (result.status === 200 && Array.isArray(result.data)) {
        setPenjualans(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch penjualan');
      }
    } catch (err) {
      setError('Error fetching penjualan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    // Transaksi penjualan tidak boleh dihapus (audit trail)
    alert('⚠️ Transaksi penjualan tidak dapat dihapus.\nData transaksi harus tetap ada untuk keperluan audit dan pelaporan.');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-blue-100 border-2 border-blue-500 p-4 text-center">
          <p className="text-blue-700 font-medium">Loading data penjualan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border-2 border-red-500 p-4">
          <p className="text-red-700 font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  const columns = [
    { key: 'idpenjualan', label: 'ID Penjualan' },
    { key: 'created_at', label: 'Tanggal' },
    { key: 'subtotal_nilai', label: 'Subtotal' },
    { key: 'ppn', label: 'PPN' },
    { key: 'total_nilai', label: 'Total' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-200 border-2 border-black p-4">
        <h1 className="text-xl font-bold uppercase text-black">Daftar Penjualan</h1>
      </div>

      {/* Controls */}
      <div className="bg-white border-2 border-black p-4">
        <div className="flex gap-2">
          <LinkButton href="/penjualan/add" variant="primary" size="md">
            Tambah Penjualan
          </LinkButton>
        </div>
      </div>

      {/* Table */}
      <Table
        data={penjualans}
        columns={columns}
        idKey="idpenjualan"
        isTransaction={true}
        detailPath="/penjualan/detail"
      />
      
      {penjualans.length === 0 && (
        <div className="bg-yellow-100 border-2 border-yellow-500 p-4">
          <p className="text-yellow-800 font-medium">
            Belum ada transaksi penjualan. Klik "Tambah Penjualan" untuk membuat transaksi baru.
          </p>
        </div>
      )}
    </div>
  );
}
