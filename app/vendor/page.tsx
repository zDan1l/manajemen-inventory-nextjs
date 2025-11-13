'use client';
import { useEffect, useState } from 'react';
import { Vendor } from '@/app/lib/type';
import { Table } from '../components/Table';
import { LinkButton } from '../components/LinkButton';
import { Alert } from '../components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from '../components/Card';

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
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
        setError((data as { error: string }).error || 'Failed to fetch vendors');
      }
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
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
          setError(data.error || 'Failed to delete vendor');
        }
      } catch (err) {
        setError('Failed to delete vendor');
      }
    }
  };

  const filterByStatus = (filterValue: string) => {
    setStatusFilter(filterValue);
    fetchVendor(filterValue);
  };

  useEffect(() => {
    fetchVendor('all');
  }, []);

  const columns = [
    { key: 'idvendor', label: 'ID' },
    { key: 'nama_vendor', label: 'Vendor Name' },
    { key: 'badan_hukum', label: 'Legal Entity' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Vendors</h1>
          <p className="text-sm text-gray-600 mt-1">Manage vendor information and contracts</p>
        </div>
        <LinkButton href="/vendor/add" variant="primary" icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        }>
          Add Vendor
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
          <CardTitle>All Vendors</CardTitle>
          <CardDescription>A list of all vendors with their contract status</CardDescription>
        </CardHeader>
        <CardBody>
          <Table
            data={vendors}
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
