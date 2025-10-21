// app/users/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { Pengadaan } from '@/app/lib/type';
import { Table } from '@/app/components/Table';
import { LinkButton } from '../components/LinkButton';

export default function Margins() {
  const [pengadaans, setPengadaans] = useState<Pengadaan[]>([]);
  const [filteredPengadaans, setFilteredPengadaans] = useState<Pengadaan[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk memetakan status numerik ke string
  const mapStatusToString = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'A': 'Diproses',
      'B': 'Pengiriman',
      'C': 'Selesai',
      'D': 'Ditolak',
    };
    return statusMap[status] || 'Unknown'; 
  };

  const fetchPengadaans = async () => {
    try {
      const res = await fetch('/api/pengadaans');
      console.log(res);
      const data: Pengadaan[] | { error: string } = await res.json();
      if (res.ok && Array.isArray(data)) {
        // Store original data for filtering
        setPengadaans(data);
        setFilteredPengadaans(data);
      } else {
        setError((data as { error: string }).error || 'Failed to fetch pengadaan');
      }
    } catch (err) {
      setError('Failed to fetch pengadaan');
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
          fetchPengadaans();
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
      setFilteredPengadaans(pengadaans);
    } else {
      let targetStatus : string;
      if (statusValue === 'A') {
        targetStatus = 'Diproses';
      } else if (statusValue === 'B') {
        targetStatus = 'Pengiriman';
      } else if (statusValue === 'C') {
        targetStatus = 'Selesai';
      } else if (statusValue === 'D') {
        targetStatus = 'Ditolak';
      }
      const filtered = pengadaans.filter(pengadaan => {
        const mappedStatus = mapStatusToString(pengadaan.status);
        return mappedStatus === targetStatus;
      });
      setFilteredPengadaans(filtered);
    }
  };

  useEffect(() => {
    fetchPengadaans();
  }, []);

  // Update filtered data when margins or statusFilter changes
  useEffect(() => {
    filterByStatus(statusFilter);
  }, [pengadaans]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  const columns = [
    { key: 'idpengadaan', label: 'ID' },
    { key: 'timestamp', label: 'Tanggal Pengadaan' },
    { key: 'status', label: 'Status Pengadaan' },
    { key: 'subtotal_nilai', label: 'Sub Total Nilai' },
    { key: 'ppn', label: 'PPN' },
    { key: 'total_nilai', label: 'Total' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-200 border-2 border-black p-4">
        <h1 className="text-xl font-bold uppercase text-black">Daftar Pengadaan</h1>
      </div>

      {/* Controls */}
      <div className="bg-white border-2 border-black p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2">
            <LinkButton href="/pengadaan/add" variant="primary" size="medium">
              Tambah Pengadaan
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
                <option value="1" className="bg-white text-black font-medium">Dipakai</option>
                <option value="0" className="bg-white text-black font-medium">Tidak Dipakai</option>
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
        data={filteredPengadaans.map(pengadaan => ({
          ...pengadaan,
          status: mapStatusToString(pengadaan.status),
        }))}
        columns={columns}
        onDelete={handleDelete}
        editPath="/pengadaan/edit"
        idKey="idpengadaan"
        variant="blue"
      />
    </div>
  );
}
