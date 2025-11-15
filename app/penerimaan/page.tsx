'use client';

import { useEffect, useState } from 'react';
import { ApiResponse, Penerimaan } from '@/app/lib/type';
import { LinkButton } from '@/app/components/LinkButton';
import { Table } from '@/app/components/Table';
import { useRouter } from 'next/navigation';

export default function PenerimaanPage() {
  const router = useRouter();
  const [penerimaans, setPenerimaans] = useState<Penerimaan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPenerimaans();
  }, []);

  const fetchPenerimaans = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/penerimaans');
      const result: ApiResponse<Penerimaan[]> = await res.json();
      
      if (result.status === 200 && Array.isArray(result.data)) {
        setPenerimaans(result.data);
      } else {
        setError('Failed to fetch penerimaan');
      }
    } catch (err) {
      setError('Error fetching penerimaan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    alert('Delete functionality tidak tersedia untuk penerimaan');
  };

  const mapStatusToString = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      'C': { label: 'Selesai', color: 'bg-yellow-200 text-yellow-800' },
      'S': { label: 'Sebagian', color: 'bg-blue-200 text-blue-800' },
      'B': { label: 'Batal', color: 'bg-green-200 text-green-800' }
    };
    return statusMap[status] || { label: status, color: 'bg-gray-200 text-gray-800' };
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  const columns = [
    { key: 'idpenerimaan', label: 'ID Penerimaan' },
    { key: 'created_at', label: 'Tanggal' },
    { key: 'status', label: 'Status' }
  ];

  const displayData = penerimaans.map(p => {
    const statusInfo = mapStatusToString(p.status);
    return {
      ...p,
      status: statusInfo.label,
      _statusColor: statusInfo.color, // Metadata untuk styling (jika diperlukan custom Table)
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00A69F] to-[#0D9488] rounded-2xl shadow-lg p-8 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Manajemen Penerimaan</h1>
            <p className="text-teal-100 mt-1">Kelola penerimaan barang dari pengadaan</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex gap-2">
          <LinkButton href="/penerimaan/add" variant="primary" size="lg">
            Tambah Penerimaan
          </LinkButton>
        </div>
      </div>

      {/* Table */}
      <Table
        data={displayData}
        columns={columns}
        onDelete={handleDelete}
        editPath="/penerimaan/edit"
        idKey="idpenerimaan"
        variant="blue"
      />
    </div>
  );
}
