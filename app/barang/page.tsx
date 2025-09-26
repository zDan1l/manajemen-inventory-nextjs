// app/users/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { Barang} from '@/app/lib/type';
import { Table } from '@/app/components/Table';
import { FormInput } from '@/app/components/FormInput';
import { LinkButton } from '../components/LinkButton';

export default function Barangs() {
  const [barangs, setBarangs] = useState<Barang[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBarangs = async () => {
    try {
      const res = await fetch('/api/barangs');
      const data: Barang[] | { error: string } = await res.json();
      if (res.ok && Array.isArray(data)) {
        const mappedBarangs = data.map((barang) => ({
            ...barang,
            status: mapStatusToString(barang.status), // Konversi status ke string
          }));
        setBarangs(mappedBarangs);
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

  useEffect(() => {
    fetchBarangs();
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  const columns = [
    { key: 'idbarang', label: 'ID' },
    { key: 'nama', label: 'Nama Barang' },
    { key: 'nama_satuan', label: 'Satuan' },
    { key: 'jenis', label: 'Jenis' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Daftar Barang</h1>
      <div className="mb-5 flex gap-4">
        <div className="flex items-center">
        <LinkButton href="/barang/add" variant="primary" size="medium">
        Tambah Barang
        </LinkButton>
        </div>
      </div>
      <Table
        data={barangs}
        columns={columns}
        onDelete={handleDelete}
        editPath="/barang/edit"
        idKey="idbarang"
      />
      <div className="mt-4 flex gap-2">
        <LinkButton href="/" variant="primary" size="medium">
        Kembali
        </LinkButton>
      </div>
    </div>
  );
}
