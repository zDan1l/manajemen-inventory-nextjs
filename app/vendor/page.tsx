'use client';
import { useEffect, useState } from 'react';
import { Vendor } from '@/app/lib/type';
import { Table } from '../components/Table';
import { LinkButton } from '../components/LinkButton';
import { Alert } from '../components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from '../components/Card';

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('aktif');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendor = async (filter: string = 'all') => {
    try {
      setLoading(true);
      let endpoint = '/api/vendors';
      if (filter === 'aktif') {
        endpoint = '/api/vendors?filter=aktif';
      }

      const res = await fetch(endpoint);
      const data: Vendor[] | { error: string } = await res.json();

      if (res.ok && Array.isArray(data)) {
        setVendors(data);
        setError(null);
      } else {
        setError((data as { error: string }).error || 'Gagal memuat data vendor');
      }
    } catch (err) {
      setError('Kesalahan jaringan: ' + (err instanceof Error ? err.message : 'Kesalahan tidak diketahui'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus vendor ini?')) {
      try {
        const res = await fetch('/api/vendors', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idvendor: id }),
        });
        if (res.ok) {
          fetchVendor(statusFilter);
        } else {
          const data = await res.json();
          setError(data.error || 'Gagal menghapus vendor');
        }
      } catch (err) {
        setError('Gagal menghapus vendor');
      }
    }
  };

  const filterByStatus = (filterValue: string) => {
    setStatusFilter(filterValue);
    fetchVendor(filterValue);
  };

  useEffect(() => {
    fetchVendor('aktif');
  }, []);

  // Helper functions to map codes to readable strings
  const mapStatusToString = (status: number | string) => {
    const numStatus = typeof status === 'string' ? parseInt(status) : status;
    return numStatus === 1 ? 'Aktif' : 'Tidak Aktif';
  };

  const mapBadanHukumToString = (badanHukum: string) => {
    switch (badanHukum) {
      case 'P':
        return 'PT (Perseroan Terbatas)';
      case 'C':
        return 'CV (Commanditaire Vennootschap)';
      case 'F':
        return 'Firma';
      case 'K':
        return 'Koperasi';
      default:
        return badanHukum;
    }
  };

  const columns = [
    { key: 'idvendor', label: 'ID' },
    { key: 'nama_vendor', label: 'Nama Vendor' },
    { key: 'badan_hukum', label: 'Badan Hukum' },
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Manajemen Vendor</h1>
              <p className="text-green-100 mt-1">Kelola informasi vendor dan kontrak</p>
            </div>
          </div>
          <LinkButton href="/vendor/add" variant="secondary" size="lg" icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }>
            Tambah Vendor
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
          <CardTitle>Semua Vendor</CardTitle>
          <CardDescription>Daftar semua vendor dengan status kontrak mereka</CardDescription>
        </CardHeader>
        <CardBody>
          <Table
            data={vendors.map(vendor => ({
              ...vendor,
              status: mapStatusToString(vendor.status),
              badan_hukum: mapBadanHukumToString(vendor.badan_hukum),
            }))}
            columns={columns}
            onDelete={handleDelete}
            editPath="/vendor/edit"
            idKey="idvendor"
            loading={loading}
          />
        </CardBody>
      </Card>
    </div>
  );
}
