'use client';
import { useEffect, useState } from 'react';
import { Satuan } from '@/app/lib/type';
import { Table } from '../components/Table';
import { LinkButton } from '../components/LinkButton';

export default function Satuans() {
  const [satuans, setSatuans] = useState<Satuan[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch satuans dengan parameter filter
  // Jika filter = 'aktif', akan menggunakan view_satuan_aktif
  // Jika filter = 'all', akan menggunakan view_satuan_all
  const fetchSatuan = async (filter : string = 'all') => {
    try {
      setLoading(true);
      // Tentukan endpoint berdasarkan filter
      let endpoint = '/api/satuans';
      if (filter === 'aktif') {
        endpoint = '/api/satuans?filter=aktif'; // Akan menggunakan view_satuan_aktif
      }

      const res = await fetch(endpoint);
      const data: Satuan[] | { error: string } = await res.json();
      if (res.ok && Array.isArray(data)) {
        // tidak perlu mapping lagi karena sudah di handle di view
        setSatuans(data);// Set initial filtered data
      } else {
        setError((data as { error: string }).error || 'Failed to fetch satuans');
      }
    } catch (err) {
      setError('Failed to fetch satuan');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk memetakan status numerik ke string
  const mapStatusToString = (status: number | string): string => {
    const statusValue = typeof status === 'string' ? parseInt(status) : status;
    const statusMap: { [key: number]: string } = {
      0: 'Tidak Bisa Dipakai',
      1: 'Bisa Dipakai',
    };
    return statusMap[statusValue] || 'Unknown'; // Fallback jika status tidak dikenali
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this Satuan?')) {
      try {
        const res = await fetch('/api/satuans', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idsatuan: id }),
        });
        if (res.ok) {
          fetchSatuan();
        } else {
          const data = await res.json();
          alert(data.error || 'Failed to delete Satuan');
        }
      } catch (err) {
        alert('Failed to delete Satuan');
      }
    }
  };

  // handle perubahan filter
  const filterByStatus = (filterValue: string) => {
    setStatusFilter(filterValue);
    fetchSatuan(filterValue);
  };

  useEffect(() => {
    // fetch data pertama kali dengan filter all
    fetchSatuan('all');
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  const columns = [
    { key: 'idsatuan', label: 'ID' },
    { key: 'nama_satuan', label: 'Nama Satuan' },
    { key: 'status', label: 'Status' }, // Tetap menggunakan key 'status'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-orange-200 border-2 border-black p-4">
        <h1 className="text-xl font-bold uppercase text-black">Daftar Satuan</h1>
      </div>

      {/* Controls */}
      <div className="bg-white border-2 border-black p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2">
            <LinkButton href="/satuan/add" variant="warning" size="medium">
              Tambah Satuan
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
                <option value="aktif" className="bg-white text-black font-medium">Bisa Dipakai (View Aktif)</option>
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-black"></div>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-600">
              {statusFilter === 'aktif' 
                ? '✓ Menggunakan view_satuan_aktif' 
                : '✓ Menggunakan view_satuan_all'}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        data={
          satuans.map(satuan => ({
            ...satuan,
            status: mapStatusToString(satuan.status),
          }))}
        columns={columns}
        onDelete={handleDelete}
        editPath="/satuan/edit"
        idKey="idsatuan"
        variant="yellow"
      />
    </div>
  );
}