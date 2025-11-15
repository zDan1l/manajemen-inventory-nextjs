'use client';
import { useEffect, useState } from 'react';
import { Margin } from '@/app/lib/type';
import { Table } from '@/app/components/Table';
import { LinkButton } from '../components/LinkButton';
import { Alert } from '../components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from '../components/Card';

export default function Margins() {
  const [margins, setMargins] = useState<Margin[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMargins = async (filter: string = 'all') => {
    try {
      setLoading(true);
      let endpoint = '/api/margins';
      if (filter === 'aktif') {
        endpoint = '/api/margins?filter=aktif';
      }
      const res = await fetch(endpoint);
      const data: Margin[] | { error: string } = await res.json();
      if (res.ok && Array.isArray(data)) {
        setMargins(data);
        setError(null);
      } else {
        setError((data as { error: string }).error || 'Gagal memuat data margin');
      }
    } catch (err) {
      setError('Gagal memuat data margin');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus margin ini?')) {
      try {
        const res = await fetch('/api/margins', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idmargin_penjualan: id }),
        });
        if (res.ok) {
          fetchMargins(statusFilter);
        } else {
          const data = await res.json();
          setError(data.error || 'Gagal menghapus margin');
        }
      } catch (err) {
        setError('Gagal menghapus margin');
      }
    }
  };

  const filterByStatus = (filterValue: string) => {
    setStatusFilter(filterValue);
    fetchMargins(filterValue);
  };

  useEffect(() => {
    fetchMargins('all');
  }, []);

  // Helper function to map status to readable string
  const mapStatusToString = (status: number | string) => {
    const numStatus = typeof status === 'string' ? parseInt(status) : status;
    return numStatus === 1 ? 'Aktif' : 'Tidak Aktif';
  };

  const columns = [
    { key: 'idmargin_penjualan', label: 'ID' },
    { key: 'created_at', label: 'Dibuat Pada' },
    { key: 'persen', label: 'Persentase' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00A69F] to-[#0D9488] rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Manajemen Margin</h1>
              <p className="text-teal-100 mt-1">Kelola persentase margin penjualan</p>
            </div>
          </div>
          <LinkButton href="/margin/add" variant="secondary" size="lg" icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }>
            Tambah Margin
          </LinkButton>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" title="Kesalahan" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filter Card */}
      <Card>
        <CardBody>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Filter berdasarkan Status:</span>
            <div className="flex gap-2">
              <button
                onClick={() => filterByStatus('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => filterByStatus('aktif')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'aktif'
                    ? 'bg-success-100 text-success-700 border border-success-300'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Aktif Saja
              </button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Table Card */}
      <Card padding="none">
        <CardHeader className="p-6">
          <CardTitle>Semua Margin</CardTitle>
          <CardDescription>Daftar semua konfigurasi margin untuk penjualan</CardDescription>
        </CardHeader>
        <CardBody>
          <Table
            data={margins.map(margin => ({
              ...margin,
              status: mapStatusToString(margin.status),
            }))}
            columns={columns}
            onDelete={handleDelete}
            editPath="/margin/edit"
            idKey="idmargin_penjualan"
            loading={loading}
          />
        </CardBody>
      </Card>
    </div>
  );
}
