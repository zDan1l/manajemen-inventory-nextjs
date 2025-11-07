'use client';
import { useEffect, useState } from 'react';
import { Vendor } from '@/app/lib/type';
import { Table } from '../components/Table';
import { LinkButton } from '../components/LinkButton';
import { map } from 'zod';

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendor = async (filter : string = 'all') => {
    try {
      setLoading(true);
      // Tentukan endpoint berdasarkan filter
      let endpoint = '/api/vendors';
      if (filter === 'aktif') {
        endpoint = '/api/vendors?filter=aktif'; // Akan menggunakan view_vendor_aktif
      }

      const res = await fetch(endpoint);
      const data: Vendor[] | { error: string } = await res.json();

      if (res.ok && Array.isArray(data)) {
        // tidak perlu mapping lagi karena sudah di handle di view
        setVendors(data);// Set initial filtered data
      } else {
        setError((data as { error: string }).error || 'Failed to fetch vendors');
      }
    } catch (err) {
      console.error('Fetch vendor error:', err);
      setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

   // Fungsi untuk memetakan status ke string
  const mapStatusToString = (status: string | number): string => {
    const statusValue = typeof status === 'string' ? parseInt(status) : status;
    const statusMap: { [key: number]: string } = {
      1: 'Dalam Kontrak',
      0: 'Selesai Kontrak',
    };
    return statusMap[statusValue] || 'Unknown';
  };

  // Fungsi untuk memetakan badan hukum ke string
  const mapBadanToString = (badan_hukum: string): string => {
    const badanMap: { [key: string]: string } = {
      'Y': 'Berbadan Hukum',
      'N': 'Tidak Berbadan Hukum',
    };
    return badanMap[badan_hukum] || 'Unknown';
  };


   // handle perubahan filter
  const filterByStatus = (filterValue: string) => {
    setStatusFilter(filterValue);
    fetchVendor(filterValue);
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
          fetchVendor();
        } else {
          const data = await res.json();
          alert(data.error || 'Failed to delete Vendor');
        }
      } catch (err) {
        alert('Failed to delete Vendor');
      }
    }
  };

  useEffect(() => {
    fetchVendor('all');
  }, []);

  if (loading) return (
    <div className="p-5 max-w-7xl mx-auto">
      <div className="bg-blue-200 border-2 border-black p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Loading Vendors...</h2>
        <div className="text-sm text-gray-700">Please wait while we fetch the vendor data.</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="p-5 max-w-7xl mx-auto">
      <div className="bg-red-200 border-2 border-black p-8 text-center">
        <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Vendors</h2>
        <div className="text-sm text-red-700 mb-4">{error}</div>
        <button 
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchVendor();
          }}
          className="px-4 py-2 bg-red-500 border-2 border-black text-white font-bold uppercase"
        >
          Retry
        </button>
      </div>
    </div>
  );

  const columns = [
    { key: 'idvendor', label: 'ID' },
    { key: 'nama_vendor', label: 'Nama Vendor' },
    { key: 'badan_hukum', label: 'Badan Hukum' },
    { key: 'status', label: 'Status' }, // Tetap menggunakan key 'status'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-purple-200 border-2 border-black p-4">
        <h1 className="text-xl font-bold uppercase text-black">Daftar Vendor</h1>
      </div>

      {/* Controls */}
      <div className="bg-white border-2 border-black p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2">
            <LinkButton href="/vendor/add" variant="primary" size="medium">
              Tambah Vendor
            </LinkButton>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-64">
              <label className="block mb-2 text-sm font-bold uppercase text-black">
                Filter Status
              </label>
              <div className="relative">
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => filterByStatus(e.target.value)}
                  className="w-full p-3 border-2 border-black bg-white font-medium text-sm text-black focus:outline-none transition-colors duration-200 appearance-none cursor-pointer pr-10"
                >
                  <option value="all" className="bg-white text-black font-medium">Semua Status</option>
                  <option value="aktif" className="bg-white text-black font-medium">Dalam Kontrak</option>
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-black"></div>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-600">
              {statusFilter === 'aktif' 
                ? '✓ Menggunakan view_vendor_aktif' 
                : '✓ Menggunakan view_vendor_all'}
            </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}   
      <Table
        data={vendors.map(vendor => ({
            ...vendor,
            status: mapStatusToString(vendor.status),
            badan_hukum: mapBadanToString(vendor.badan_hukum),
          }))}
        columns={columns}
        onDelete={handleDelete}
        editPath="/vendor/edit"
        idKey="idvendor"
        variant="purple"
      />
    </div>
  );
}