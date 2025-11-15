'use client';
import { useEffect, useState } from 'react';
import { Barang } from '@/app/lib/type';
import { Table } from '@/app/components/Table';
import { LinkButton } from '../components/LinkButton';
import { Alert } from '../components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from '../components/Card';
import { formatCurrency } from '@/app/lib/utils/format';

export default function Barangs() {
  const [barangs, setBarangs] = useState<Barang[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('aktif');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBarangs = async (filter: string = 'all') => {
    try {
      setLoading(true);
      
      let endpoint = '/api/barangs';
      if (filter === 'aktif') {
        endpoint = '/api/barangs?filter=aktif';
      }
      
      const res = await fetch(endpoint);
      const data: Barang[] | { error: string } = await res.json();
      
      if (res.ok && Array.isArray(data)) {
        setBarangs(data);
        setError(null);
      } else {
        setError((data as { error: string }).error || 'Gagal memuat data barang');
      }
    } catch (err) {
      setError('Gagal memuat data barang');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
      try {
        const res = await fetch('/api/barangs', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idbarang: id }),
        });
        if (res.ok) {
          fetchBarangs(statusFilter);
        } else {
          const data = await res.json();
          setError(data.error || 'Gagal menghapus barang');
        }
      } catch (err) {
        setError('Gagal menghapus barang');
      }
    }
  };

  const handleFilterChange = (filterValue: string) => {
    setStatusFilter(filterValue);
    fetchBarangs(filterValue);
  };

  useEffect(() => {
    fetchBarangs('aktif');
  }, []);

  // Helper functions to map codes to readable strings
  const mapStatusToString = (status: number | string) => {
    const numStatus = typeof status === 'string' ? parseInt(status) : status;
    return numStatus === 1 ? 'Aktif' : 'Tidak Aktif';
  };

  const mapJenisToString = (jenis: string) => {
    switch (jenis) {
      case 'A':
        return 'Alat Tulis Kantor';
      case 'B':
        return 'Perabotan Rumah Tangga';
      case 'C':
        return 'Elektronik';
      case 'D':
        return 'Makanan & Minuman';
      case 'E':
        return 'Aksesoris Elektronik';
      default:
        return "Tidak Ditemukan";
    }
  };

  const columns = [
    { key: 'idbarang', label: 'ID' },
    { key: 'nama', label: 'Nama Barang' },
    { key: 'nama_satuan', label: 'Satuan' },
    { key: 'jenis', label: 'Jenis' },
    { key: 'harga', label: 'Harga' },
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Manajemen Barang</h1>
              <p className="text-blue-100 mt-1">Kelola item inventori dan detailnya</p>
            </div>
          </div>
          <LinkButton href="/barang/add" variant="secondary" size="lg" icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }>
            Tambah Barang
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
                onClick={() => handleFilterChange('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => handleFilterChange('aktif')}
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
          <CardTitle>Semua Barang</CardTitle>
          <CardDescription>Daftar lengkap item inventori dengan detailnya</CardDescription>
        </CardHeader>
        <CardBody>
          <Table
            data={barangs.map(barang => ({
              ...barang,
              status: mapStatusToString(barang.status),
              jenis: mapJenisToString(barang.jenis),
              harga: formatCurrency(barang.harga),
            }))}
            columns={columns}
            onDelete={handleDelete}
            editPath="/barang/edit"
            idKey="idbarang"
            loading={loading}
          />
        </CardBody>
      </Card>
    </div>
  );
}
