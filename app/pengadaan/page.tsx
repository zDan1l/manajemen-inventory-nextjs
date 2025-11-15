// app/users/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { Pengadaan } from '@/app/lib/type';
import { Table } from '@/app/components/Table';
import { LinkButton } from '../components/LinkButton';
import { formatCurrency } from '@/app/lib/utils/format';

export default function Margins() {
  const [pengadaans, setPengadaans] = useState<Pengadaan[]>([]);
  const [filteredPengadaans, setFilteredPengadaans] = useState<Pengadaan[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk memetakan status numerik ke string
  const mapStatusToString = (status: string): string => {
    const statusMap: { [key: string]: string } = { 
      'P': 'Diproses', // P=Proses, S=Sebagian, C=Selesai, B=Batal
      'S': 'Sebagian',
      'C': 'Selesai',
      'B': 'Batal',
    };
    return statusMap[status] || 'Unknown'; 
  };

  const fetchPengadaans = async () => {
    try {
      const res = await fetch('/api/pengadaans');
      const data: Pengadaan[] | { error: string } = await res.json();
      if (res.ok && Array.isArray(data)) {
        // Store original data for filtering
        setPengadaans(data);
        setFilteredPengadaans(data);
      } else {
        setError((data as { error: string }).error || 'Failed to fetch pengadaan');
      }
    } catch (err) {
      setError('Failed to fetch pengadaan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    // Transaksi pengadaan tidak boleh dihapus
    // Gunakan fitur "Batalkan" jika perlu membatalkan pengadaan
    alert('⚠️ Transaksi pengadaan tidak dapat dihapus.\n\nJika ingin membatalkan pengadaan, silakan gunakan fitur "Batalkan Pengadaan" (status akan berubah menjadi Batal).\n\nData transaksi harus tetap ada untuk keperluan audit.');
  };

  // Filter function based on status
  const filterByStatus = (statusValue: string) => {
    setStatusFilter(statusValue);
    if (statusValue === 'all') {
      setFilteredPengadaans(pengadaans);
    } else {
      let targetStatus : string;
      if (statusValue === 'P') {
        targetStatus = 'Diproses';
      } else if (statusValue === 'S') {
        targetStatus = 'Sebagian';
      } else if (statusValue === 'C') {
        targetStatus = 'Selesai';
      } else if (statusValue === 'B') {
        targetStatus = 'Batal';
      }
      const filtered = pengadaans.filter(pengadaan => {
        const mappedStatus = mapStatusToString(pengadaan.status);
        return mappedStatus === targetStatus;
      });
      setFilteredPengadaans(filtered);
    }
  };

  useEffect(() => {
    fetchPengadaans();
  }, []);

  // Update filtered data when margins or statusFilter changes
  useEffect(() => {
    filterByStatus(statusFilter);
  }, [pengadaans]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  const columns = [
    { key: 'idpengadaan', label: 'ID' },
    { key: 'tanggal', label: 'Tanggal Pengadaan' },
    { key: 'status', label: 'Status Pengadaan' },
    { key: 'subtotal_nilai', label: 'Sub Total Nilai' },
    { key: 'ppn', label: 'PPN' },
    { key: 'total_nilai', label: 'Total' },
  ];

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
            <h1 className="text-3xl font-bold text-white">Manajemen Pengadaan</h1>
            <p className="text-teal-100 mt-1">Kelola transaksi pengadaan barang dari vendor</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2">
            <LinkButton href="/pengadaan/create" variant="primary" size="lg">
              Tambah Pengadaan
            </LinkButton>
          </div>
          
          <div className="w-full md:w-64">
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Filter Status
            </label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => filterByStatus(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl bg-white font-medium text-sm text-gray-700 focus:outline-none focus:ring-4 focus:ring-[#00A69F]/10 focus:border-[#00A69F] transition-all duration-200 appearance-none cursor-pointer pr-10"
              >
                <option value="all">Semua Status</option>
                <option value="P">Diproses</option>
                <option value="S">Sebagian</option>
                <option value="C">Lengkap / Selesai</option>
                <option value="B">Batal</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        data={filteredPengadaans.map(pengadaan => ({
          ...pengadaan,
          status: mapStatusToString(pengadaan.status),
          subtotal_nilai: formatCurrency(pengadaan.subtotal_nilai),
          ppn: formatCurrency(pengadaan.ppn),
          total_nilai: formatCurrency(pengadaan.total_nilai),
        }))}
        columns={columns}
        idKey="idpengadaan"
        isTransaction={true}
        detailPath="/pengadaan/detail"
      />
    </div>
  );
}
