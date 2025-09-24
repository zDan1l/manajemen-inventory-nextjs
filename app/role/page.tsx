// app/role/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Role, PaginatedResponse } from '@/app/lib/type';
import { Table } from '../components/Table';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';
import { LinkButton } from '../components/LinkButton';

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [page,] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
      try {
        const res = await fetch('/api/roles');
        const data: Role[] | { error: string } = await res.json();
        if (res.ok && Array.isArray(data)) {
          setRoles(data);
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
        const res = await fetch('/api/roles', {
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
    <div className="p-5 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Daftar Peran</h1>
      <div className="mb-5 flex gap-4">
        <div className="flex items-center">
                <LinkButton href="/role/add" variant="primary" size="medium">
                Tambah Peran
                </LinkButton>
        </div>
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
        <LinkButton href="/" variant="primary" size="medium">
        Kembali
        </LinkButton>
      </div>
    </div>
  );
}
