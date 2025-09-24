// app/users/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, PaginatedResponse } from '@/app/lib/type';
import { Table } from '@/app/components/Table';
import { FormInput } from '@/app/components/FormInput';
import { Button } from '@/app/components/Button';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data: User[] | { error: string } = await res.json();
      if (res.ok && Array.isArray(data)) {
        setUsers(data);
      } else {
        setError((data as { error: string }).error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch('/api/users', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ iduser: id }),
        });
        if (res.ok) {
          fetchUsers();
        } else {
          const data = await res.json();
          alert(data.error || 'Failed to delete user');
        }
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  const columns = [
    { key: 'iduser', label: 'ID' },
    { key: 'username', label: 'Username' },
    { key: 'role_name', label: 'Peran' },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Daftar Pengguna</h1>
      <div className="mb-5 flex gap-4">
        <Link href="/user/add" className="px-4 py-2 bg-blue-600 text-white rounded">Tambah Pengguna</Link>
        <Link href="/role" className="px-4 py-2 bg-green-600 text-white rounded">Kelola Peran</Link>
        <FormInput
          label="Cari"
          type="text"
          value={search}
          onChange={setSearch}
          required={false}
        />
      </div>
      <Table
        data={users}
        columns={columns}
        onDelete={handleDelete}
        editPath="/user/edit"
      />
      <div className="mt-4 flex gap-2">
        <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
        <span>Page {page} of {Math.ceil(total / pageSize)}</span>
        <Button onClick={() => setPage(p => p + 1)} disabled={page * pageSize >= total}>Next</Button>
      </div>
    </div>
  );
}
