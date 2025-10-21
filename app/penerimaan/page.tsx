// app/users/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { Penerimaan } from '@/app/lib/type';
import { Table } from '@/app/components/Table';
import { LinkButton } from '../components/LinkButton';

export default function Margins() {
  const [penerimaans, setPenerimaans] = useState<Penerimaan[]>([]);
  const [filteredPenerimaans, setFilteredPenerimaans] = useState<Penerimaan[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk memetakan status numerik ke string
  const mapStatusToString = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'A': 'Dikirim',
      'B': 'Diterima',
      'C': 'Ditolak',
    };
    return statusMap[status] || 'Unknown'; 
  };

  const fetchPenerimaans = async () => {
    try {
      const res = await fetch('/api/penerimaans');
      console.log(res);
      const data: Penerimaan[] | { error: string } = await res.json();
      if (res.ok && Array.isArray(data)) {
        // Store original data for filtering
        setPenerimaans(data);
        setFilteredPenerimaans(data);
      } else {
        setError((data as { error: string }).error || 'Failed to fetch penerimaan');
      }
    } catch (err) {
      setError('Failed to fetch penerimaan');
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
          fetchPenerimaans();
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
    if (statusValue === 'all') {
      setFilteredPenerimaans(penerimaans);
    } else {
      let targetStatus : string;
      if (statusValue === 'A') {
        targetStatus = 'Dikirim';
      } else if (statusValue === 'B') {
        targetStatus = 'Diterima';
      } else if (statusValue === 'C') {
        targetStatus = 'Ditolak';
      } 
      const filtered = penerimaans.filter(penerimaan => {
        const mappedStatus = mapStatusToString(penerimaan.status);
        return mappedStatus === targetStatus;
      });
      setFilteredPenerimaans(filtered);
    }
  };

  useEffect(() => {
    fetchPenerimaans();
  }, []);

  // Update filtered data when margins or statusFilter changes
  useEffect(() => {
    filterByStatus(statusFilter);
  }, [penerimaans]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  const columns = [
    { key: 'idpenerimaan', label: 'ID' },
    { key: 'created_at', label: 'Tanggal Penerimaan' },
    { key: 'status', label: 'Status Pengadaan' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-200 border-2 border-black p-4">
        <h1 className="text-xl font-bold uppercase text-black">Daftar Penerimaan</h1>
      </div>

      {/* Controls */}
      <div className="bg-white border-2 border-black p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2">
            <LinkButton href="/pengadaan/add" variant="primary" size="medium">
              Tambah Penerimaan
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
                <option value="all" className="bg-white text-black font-medium">Semua Status</option>
                <option value="A" className="bg-white text-black font-medium">Dikirim</option>
                <option value="B" className="bg-white text-black font-medium">Diterima</option>
                <option value="C" className="bg-white text-black font-medium">Ditolak</option>
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-black"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        data={filteredPenerimaans.map(penerimaan => ({
          ...penerimaan,
          status: mapStatusToString(penerimaan.status),
        }))}
        columns={columns}
        onDelete={handleDelete}
        editPath="/penerimaan/edit"
        idKey="idpenerimaan"
        variant="blue"
      />
    </div>
  );
}
