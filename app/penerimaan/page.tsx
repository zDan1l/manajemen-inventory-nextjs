'use client';

import { useEffect, useState } from 'react';
import { ApiResponse } from '@/app/lib/type';
import { LinkButton } from '@/app/components/LinkButton';
import { Card } from '@/app/components/Card';
import { Table } from '@/app/components/Table';
import { formatCurrency, formatDate } from '@/app/lib/utils/format';

interface PenerimaanWithDetails {
  idpenerimaan: number;
  created_at: string | Date;
  status: string;
  idpengadaan: number;
  iduser: number;
  username?: string;
  nama_vendor?: string;
  total_items?: number;
  total_nilai?: number;
}

export default function PenerimaanPage() {
  const [penerimaans, setPenerimaans] = useState<PenerimaanWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPenerimaans();
  }, []);

  const fetchPenerimaans = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/penerimaans');
      const result: ApiResponse<PenerimaanWithDetails[]> = await res.json();
      
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

  const mapStatusToString = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      'C': { label: 'Selesai', color: 'bg-blue-100 text-blue-700 border border-blue-300' },
      'S': { label: 'Sebagian Diterima', color: 'bg-amber-100 text-amber-700 border border-amber-300' }
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A69F]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error: {error}
        </div>
      </div>
    );
  }

  const columns = [
    { key: 'idpenerimaan', label: 'ID Penerimaan' },
    { key: 'created_at', label: 'Tanggal' },
    { key: 'username', label: 'User' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00A69F] to-[#0D9488] rounded-2xl shadow-lg p-8">
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

      {/* Action Button */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <LinkButton href="/penerimaan/add" variant="primary" size="lg">
          + Tambah Penerimaan Baru
        </LinkButton>
      </div>

      {/* Data Table */}
      <Table
        data={penerimaans.map(penerimaan => {
          const statusInfo = mapStatusToString(penerimaan.status);
          return {
            ...penerimaan,
            idpenerimaan: `#${penerimaan.idpenerimaan}`,
            created_at: formatDate(penerimaan.created_at),
            idpengadaan: `#${penerimaan.idpengadaan}`,
            nama_vendor: penerimaan.nama_vendor || '-',
            username: penerimaan.username || `User #${penerimaan.iduser}`,
            total_items: penerimaan.total_items || 0,
            total_nilai: penerimaan.total_nilai ? formatCurrency(penerimaan.total_nilai) : 'Rp 0',
            status: statusInfo.label,
            _statusColor: statusInfo.color, // For styling
          };
        })}
        columns={columns}
        idKey="idpenerimaan"
        isTransaction={true}
        loading={loading}
      />

      {penerimaans.length === 0 && !loading && (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center py-12">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-gray-500 text-lg">Belum ada data penerimaan</p>
            <p className="text-gray-400 text-sm mt-2">Klik tombol "Tambah Penerimaan Baru" untuk memulai</p>
          </div>
        </Card>
      )}
    </div>
  );
}
