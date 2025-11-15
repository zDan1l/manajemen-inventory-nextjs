'use client';
import { useEffect, useState } from 'react';
import { Satuan } from '@/app/lib/type';
import { Table } from '../components/Table';
import { LinkButton } from '../components/LinkButton';
import { Alert } from '../components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from '../components/Card';

export default function Satuans() {
  const [satuans, setSatuans] = useState<Satuan[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('aktif');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSatuan = async (filter: string = 'all') => {
    try {
      setLoading(true);
      let endpoint = '/api/satuans';
      if (filter === 'aktif') {
        endpoint = '/api/satuans?filter=aktif';
      }

      const res = await fetch(endpoint);
      const data: Satuan[] | { error: string } = await res.json();
      if (res.ok && Array.isArray(data)) {
        setSatuans(data);
        setError(null);
      } else {
        setError((data as { error: string }).error || 'Gagal memuat data satuan');
      }
    } catch (err) {
      setError('Gagal memuat data satuan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus satuan ini?')) {
      try {
        const res = await fetch('/api/satuans', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idsatuan: id }),
        });
        if (res.ok) {
          fetchSatuan(statusFilter);
        } else {
          const data = await res.json();
          setError(data.error || 'Gagal menghapus satuan');
        }
      } catch (err) {
        setError('Gagal menghapus satuan');
      }
    }
  };

  const filterByStatus = (filterValue: string) => {
    setStatusFilter(filterValue);
    fetchSatuan(filterValue);
  };

  useEffect(() => {
    fetchSatuan('aktif');
  }, []);

  // Helper function to map status to readable string
  const mapStatusToString = (status: number | string) => {
    const numStatus = typeof status === 'string' ? parseInt(status) : status;
    return numStatus === 1 ? 'Aktif' : 'Tidak Aktif';
  };

  const columns = [
    { key: 'idsatuan', label: 'ID' },
    { key: 'nama_satuan', label: 'Nama Satuan' },
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Manajemen Satuan</h1>
              <p className="text-orange-100 mt-1">Kelola satuan pengukuran untuk item inventori</p>
            </div>
          </div>
          <LinkButton href="/satuan/add" variant="secondary" size="lg" icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }>
            Tambah Satuan
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
          <CardTitle>Semua Satuan</CardTitle>
          <CardDescription>Daftar semua satuan pengukuran dalam sistem</CardDescription>
        </CardHeader>
        <CardBody>
          <Table
            data={satuans.map(satuan => ({
              ...satuan,
              status: mapStatusToString(satuan.status),
            }))}
            columns={columns}
            onDelete={handleDelete}
            editPath="/satuan/edit"
            idKey="idsatuan"
            loading={loading}
          />
        </CardBody>
      </Card>
    </div>
  );
}
