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
        setError((data as { error: string }).error || 'Failed to fetch margins');
      }
    } catch (err) {
      setError('Failed to fetch margins');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this margin?')) {
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
          setError(data.error || 'Failed to delete margin');
        }
      } catch (err) {
        setError('Failed to delete margin');
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

  const columns = [
    { key: 'idmargin_penjualan', label: 'ID' },
    { key: 'created_at', label: 'Created At' },
    { key: 'persen', label: 'Percentage' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Margins</h1>
          <p className="text-sm text-gray-600 mt-1">Manage sales margin percentages</p>
        </div>
        <LinkButton href="/margin/add" variant="primary" icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        }>
          Add Margin
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
                onClick={() => filterByStatus('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => filterByStatus('aktif')}
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
          <CardTitle>All Margins</CardTitle>
          <CardDescription>A list of all margin configurations for sales</CardDescription>
        </CardHeader>
        <CardBody>
          <Table
            data={margins}
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
