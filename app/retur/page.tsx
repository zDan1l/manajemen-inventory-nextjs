// app/role/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { Retur } from '@/app/lib/type';
import { Table } from '../components/Table';
import { LinkButton } from '../components/LinkButton';

export default function Roles() {
  const [returs, setReturs] = useState<Retur[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReturs = async () => {
      try {
        const res = await fetch('/api/returs');
        const data: Retur[] | { error: string } = await res.json();
        if (res.ok && Array.isArray(data)) {
          setReturs(data);
        } else {
          setError((data as { error: string }).error || 'Failed to fetch retur');
        }
      } catch (err) {
        setError('Failed to fetch retur');
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
          fetchReturs();
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
    fetchReturs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  const columns = [
    { key: 'idretur', label: 'ID' },
    { key: 'created_at', label: 'Tanggal Pengembalian' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-200 border-2 border-black p-4">
        <h1 className="text-xl font-bold uppercase text-black">Daftar Retur</h1>
      </div>

        {/* Controls */}
      <div className="bg-white border-2 border-black p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-2">
            <LinkButton href="/role/add" variant="primary" size="medium">
              Tambah Retur
            </LinkButton>
          </div>
        </div>
      </div>
        <Table
          data={returs}
          columns={columns}
          onDelete={handleDelete}
          editPath="/role/edit"
          idKey="idretur"
        />
      </div>
  );
}
