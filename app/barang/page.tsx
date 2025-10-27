// app/users/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { Barang} from '@/app/lib/type';
import { Table } from '@/app/components/Table';
import { FormInput } from '@/app/components/FormInput';
import { LinkButton } from '../components/LinkButton';

export default function Barangs() {
  const [barangs, setBarangs] = useState<Barang[]>([]);
  const [filteredBarangs, setFilteredBarangs] = useState<Barang[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBarangs = async () => {
    try {
      const res = await fetch('/api/barangs');
      const data: Barang[] | { error: string } = await res.json();
      if (res.ok && Array.isArray(data)) {
        const mappedBarangs = data.map((barang) => ({
            ...barang,
            status: mapStatusToString(typeof barang.status === 'number' ? barang.status : parseInt(barang.status.toString())), // Konversi status ke string
          }));
        setBarangs(mappedBarangs);
        setFilteredBarangs(mappedBarangs); // Set initial filtered data
      } else {
        setError((data as { error: string }).error || 'Failed to fetch barangs');
      }
    } catch (err) {
      setError('Failed to fetch barangs');
    } finally {
      setLoading(false);
    }
  };
  // Fungsi untuk memetakan status numerik ke string
  const mapStatusToString = (status: number): string => {
    const statusMap: { [key: number]: string } = {
      0: 'Rusak',
      1: 'Baik',
    };
    return statusMap[status] || 'Unknown'; // Fallback jika status tidak dikenali
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this barang?')) {
      try {
        const res = await fetch('/api/barangs', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idbarang: id }),
        });
        if (res.ok) {
          fetchBarangs();
        } else {
          const data = await res.json();
          alert(data.error || 'Failed to delete barang');
        }
      } catch (err) {
        alert('Failed to delete barang');
      }
    }
  };

  // Filter function based on status
  const filterByStatus = (statusValue: string) => {
    setStatusFilter(statusValue);
    if (statusValue === 'all') {
      setFilteredBarangs(barangs);
    } else {
      const targetStatus = statusValue === '1' ? 'Baik' : 'Rusak';
      const filtered = barangs.filter(barang => barang.status === targetStatus);
      setFilteredBarangs(filtered);
    }
  };

  useEffect(() => {
    fetchBarangs();
  }, []);

  // Update filtered data when barangs or statusFilter changes
  useEffect(() => {
    filterByStatus(statusFilter);
  }, [barangs]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

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
      <div className="bg-yellow-200 border-2 border-black p-4">
        <h1 className="text-xl font-bold uppercase text-black">Daftar Barang</h1>
      </div>

      {/* Controls */}
      <div className="bg-white border-2 border-black p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2">
            <LinkButton href="/barang/add" variant="warning" size="medium">
              Tambah Barang
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
                <option value="1" className="bg-white text-black font-medium">Baik</option>
                <option value="0" className="bg-white text-black font-medium">Rusak</option>
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
        data={filteredBarangs}
        columns={columns}
        onDelete={handleDelete}
        editPath="/barang/edit"
        idKey="idbarang"
        variant="yellow"
      />
    
    </div>
  );
}
