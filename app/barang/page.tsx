'use client';
import { useEffect, useState } from 'react';
import { Barang } from '@/app/lib/type';
import { Table } from '@/app/components/Table';
import { LinkButton } from '../components/LinkButton';
import { Alert } from '../components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from '../components/Card';

export default function Barangs() {
  const [barangs, setBarangs] = useState<Barang[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
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
        setError((data as { error: string }).error || 'Failed to fetch items');
      }
    } catch (err) {
      setError('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
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
          setError(data.error || 'Failed to delete item');
        }
      } catch (err) {
        setError('Failed to delete item');
      }
    }
  };

  const handleFilterChange = (filterValue: string) => {
    setStatusFilter(filterValue);
    fetchBarangs(filterValue);
  };

  useEffect(() => {
    fetchBarangs('all');
  }, []);

  const columns = [
    { key: 'idbarang', label: 'ID' },
    { key: 'nama', label: 'Item Name' },
    { key: 'nama_satuan', label: 'Unit' },
    { key: 'jenis', label: 'Type' },
    { key: 'harga', label: 'Price' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Items</h1>
          <p className="text-sm text-gray-600 mt-1">Manage inventory items and their details</p>
        </div>
        <LinkButton href="/barang/add" variant="primary" icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        }>
          Add Item
        </LinkButton>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" title="Error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filter Card */}
      <Card>
        <CardBody>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange('aktif')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'aktif'
                    ? 'bg-success-100 text-success-700 border border-success-300'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Active Only
              </button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Table Card */}
      <Card padding="none">
        <CardHeader className="p-6">
          <CardTitle>All Items</CardTitle>
          <CardDescription>A complete list of inventory items with their details</CardDescription>
        </CardHeader>
        <CardBody>
          <Table
            data={barangs}
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
