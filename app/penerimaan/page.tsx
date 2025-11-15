'use client';

import { useEffect, useState } from 'react';
import { ApiResponse } from '@/app/lib/type';
import { LinkButton } from '@/app/components/LinkButton';
import { Card } from '@/app/components/Card';
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
      'P': { label: 'Diproses', color: 'bg-blue-100 text-blue-700 border border-blue-300' },
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
      <Card className="p-6">
        <LinkButton href="/penerimaan/add" variant="primary" size="lg">
          + Tambah Penerimaan Baru
        </LinkButton>
      </Card>

      {/* Data List */}
      {penerimaans.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">Belum ada data penerimaan</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {penerimaans.map((penerimaan) => {
            const statusInfo = mapStatusToString(penerimaan.status);
            return (
              <Card key={penerimaan.idpenerimaan} className="p-6 hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* ID & Tanggal */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">ID Penerimaan</p>
                    <p className="text-lg font-bold text-[#00A69F]">#{penerimaan.idpenerimaan}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      {formatDate(penerimaan.created_at)}
                    </p>
                  </div>

                  {/* Vendor & Pengadaan */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Vendor</p>
                    <p className="font-semibold text-gray-900">
                      {penerimaan.nama_vendor || '-'}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Pengadaan #{penerimaan.idpengadaan}
                    </p>
                  </div>

                  {/* User & Items */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Diterima Oleh</p>
                    <p className="font-semibold text-gray-900">
                      {penerimaan.username || `User #${penerimaan.iduser}`}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {penerimaan.total_items || 0} item barang
                    </p>
                  </div>

                  {/* Status & Total */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Total Nilai</p>
                      <p className="text-lg font-bold text-gray-900">
                        {penerimaan.total_nilai ? formatCurrency(penerimaan.total_nilai) : 'Rp 0'}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
