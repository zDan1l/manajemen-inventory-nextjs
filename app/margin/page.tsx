// app/users/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { Margin} from '@/app/lib/type';
import { Table } from '@/app/components/Table';
import { LinkButton } from '../components/LinkButton';

export default function Margins() {
  const [margins, setMargins] = useState<Margin[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk memetakan status numerik ke string
  const mapStatusToString = (status: number): string => {
    const statusMap: { [key: number]: string } = {
      1: 'Dipakai',
      0: 'Tidak Dipakai',
    };
    return statusMap[status] || 'Unknown'; 
  };

  const fetchMargins = async (filter : string = 'all') => {
    try {
      setLoading(true);
      // Tentukan endpoint berdasarkan filter
      let endpoint = '/api/margins';
      if (filter === 'aktif') {
        endpoint = '/api/margins?filter=aktif'; // Akan menggunakan view_margin_aktif
      }
      const res = await fetch(endpoint);
      const data: Margin[] | { error: string } = await res.json();
      console.log(data);
      if (res.ok && Array.isArray(data)) {
        // tidak perlu mapping lagi karena sudah di handle di view
        setMargins(data);
      } else {
        setError((data as { error: string }).error || 'Failed to fetch margin');
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
          fetchMargins();
        } else {
          const data = await res.json();
          alert(data.error || 'Failed to delete margins');
        }
      } catch (err) {
        alert('Failed to delete margins');
      }
    }
  };

  // Filter function based on status
  const filterByStatus = (statusValue: string) => {
    setStatusFilter(statusValue);
    fetchMargins(statusValue);
  };

  useEffect(() => {
    fetchMargins('all');
  }, []);


  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  const columns = [
    { key: 'idmargin_penjualan', label: 'ID' },
    { key: 'created_at', label: 'Created At' },
    { key: 'persen', label: 'Persen' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-200 border-2 border-black p-4">
        <h1 className="text-xl font-bold uppercase text-black">Daftar Margin</h1>
      </div>

      {/* Controls */}
      <div className="bg-white border-2 border-black p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2">
            <LinkButton href="/margin/add" variant="primary" size="medium">
              Tambah Margin
            </LinkButton>
          </div>
          
          <div className="w-full md:w-64">
            <label className="block mb-2 text-sm font-bold uppercase text-black">
              Filter Status
            </label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => filterByStatus(e.target.value)}
                className="w-full p-3 border-2 border-black bg-white font-medium text-sm text-black focus:outline-none transition-colors duration-200 appearance-none cursor-pointer pr-10"
              >
                <option value="all" className="bg-white text-black font-medium">Semua Status (View All)</option>
                <option value="aktif" className="bg-white text-black font-medium">Dipakai (View Aktif)</option>
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

      {/* Table */}
      <Table
        data={margins.map(margin => ({
          ...margin,
          status: mapStatusToString(margin.status),
        }))}
        columns={columns}
        onDelete={handleDelete}
        editPath="/margin/edit"
        idKey="idmargin_penjualan"
        variant="blue"
      />
    </div>
  );
}
