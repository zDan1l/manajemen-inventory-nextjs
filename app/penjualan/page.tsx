// app/role/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { Penjualan } from '@/app/lib/type';
import { Table } from '../components/Table';
import { LinkButton } from '../components/LinkButton';

export default function Roles() {
  const [penjualans, setPenjualans] = useState<Penjualan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPenjualans = async () => {
      try {
        const res = await fetch('/api/penjualans');
        const data: Penjualan[] | { error: string } = await res.json();
        if (res.ok && Array.isArray(data)) {
          setPenjualans(data);
        } else {
          setError((data as { error: string }).error || 'Failed to fetch penjualans');
        }
      } catch (err) {
        setError('Failed to fetch penjualan');
      } finally {
        setLoading(false);
      }
    };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this role?')) {
      try {
        const res = await fetch('/api/roles', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idrole: id }),
        });
        if (res.ok) {
          fetchPenjualans();
        } else {
          const data = await res.json();
          alert(data.error || 'Failed to delete role');
        }
      } catch (err) {
        alert('Failed to delete role');
      }
    }
  };

  useEffect(() => {
    fetchPenjualans();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  const columns = [
    { key: 'idpenjualan', label: 'ID' },
    { key: 'created_at', label: 'Tanggal Penjualan' },
    { key: 'subtotal_nilai', label: 'Sub Total Nilai' },
    { key: 'ppn', label: 'PPN' },
    { key: 'total_nilai', label: 'Total Nilai' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-200 border-2 border-black p-4">
        <h1 className="text-xl font-bold uppercase text-black">Daftar Penjualan</h1>
      </div>

        {/* Controls */}
      <div className="bg-white border-2 border-black p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2">
            <LinkButton href="/penjualan/add" variant="primary" size="medium">
              Tambah Penjualan
            </LinkButton>
          </div>
        </div>
      </div>
        <Table
          data={penjualans}
          columns={columns}
          onDelete={handleDelete}
          editPath="/role/edit"
          idKey="idpenjualan"
        />
      </div>
  );
}
