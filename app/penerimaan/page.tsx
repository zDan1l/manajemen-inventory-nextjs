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
      <div className="bg-blue-200 border-2 border-black p-4">
        <h1 className="text-xl font-bold uppercase text-black">Daftar Penerimaan</h1>
      </div>

      {/* Controls */}
      <div className="bg-white border-2 border-black p-4">
        <div className="flex gap-2">
          <LinkButton href="/penerimaan/add" variant="primary" size="medium">
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
