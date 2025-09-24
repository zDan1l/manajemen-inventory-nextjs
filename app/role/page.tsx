// app/role/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Role, PaginatedResponse } from '@/app/lib/type';
import { Table } from '../components/Table';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      const res = await fetch(`/api/role?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`);
      const data: PaginatedResponse<Role> | { error: string } = await res.json();
      if (res.ok && 'data' in data) {
        setRoles(data.data);
        setTotal(data.total);
      } else {
        setError((data as { error: string }).error || 'Failed to fetch roles');
      }
    } catch (err) {
      setError('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this role?')) {
      try {
        const res = await fetch('/api/role', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idrole: id }),
        });
        if (res.ok) {
          fetchRoles();
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
    fetchRoles();
  }, [page, search]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  const columns = [
    { key: 'idrole', label: 'ID' },
    { key: 'nama_role', label: 'Nama Peran' },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Daftar Peran</h1>
      <div className="mb-5 flex gap-4">
        <Link href="/role/add" className="px-4 py-2 bg-blue-600 text-white rounded">Tambah Peran</Link>
        <Link href="/users" className="px-4 py-2 bg-green-600 text-white rounded">Kelola Pengguna</Link>
        <FormInput
          label="Cari"
          type="text"
          value={search}
          onChange={setSearch}
          required={false}
        />
      </div>
      <Table
        data={roles}
        columns={columns}
        onDelete={handleDelete}
        editPath="/role/edit"
      />
      <div className="mt-4 flex gap-2">
        <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
        <span>Page {page} of {Math.ceil(total / pageSize)}</span>
        <Button onClick={() => setPage(p => p + 1)} disabled={page * pageSize >= total}>Next</Button>
      </div>
    </div>
  );
}
