// app/users/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { Margin} from '@/app/lib/type';
import { Table } from '@/app/components/Table';
import { FormInput } from '@/app/components/FormInput';
import { LinkButton } from '../components/LinkButton';

export default function Margins() {
  const [margins, setMargins] = useState<Margin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMargins = async () => {
    try {
      const res = await fetch('/api/margins');
      const data: Margin[] | { error: string } = await res.json();
      if (res.ok && Array.isArray(data)) {
        const mappedMargins = data.map((margin) => ({
            ...margin,
            status: mapStatusToString(margin.status), // Konversi status ke string
          }));
        setMargins(mappedMargins);
      } else {
        setError((data as { error: string }).error || 'Failed to fetch margin');
      }
    } catch (err) {
      setError('Failed to fetch margins');
    } finally {
      setLoading(false);
    }
  };
  // Fungsi untuk memetakan status numerik ke string
  const mapStatusToString = (status: number): string => {
    const statusMap: { [key: number]: string } = {
      1: 'Dipakai',
      0: 'Tidak Dipakai',
    };
    return statusMap[status] || 'Unknown'; 
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

  useEffect(() => {
    fetchMargins();
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  const columns = [
    { key: 'idmargin_penjualan', label: 'ID' },
    { key: 'username', label: 'User' },
    { key: 'created_at', label: 'Created At' },
    { key: 'persen', label: 'Persen' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Daftar Margin</h1>
      <div className="mb-5 flex gap-4">
        <div className="flex items-center">
        <LinkButton href="/margin/add" variant="primary" size="medium">
        Tambah Margin
        </LinkButton>
        </div>
      </div>
      <Table
        data={margins}
        columns={columns}
        onDelete={handleDelete}
        editPath="/margin/edit"
        idKey="idmargin_penjualan"
      />
      <div className="mt-4 flex gap-2">
        <LinkButton href="/" variant="primary" size="medium">
        Kembali
        </LinkButton>
      </div>
    </div>
  );
}
