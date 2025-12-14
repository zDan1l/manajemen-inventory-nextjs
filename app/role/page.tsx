'use client';
import { useEffect, useState } from 'react';
import { Role } from '@/app/lib/type';
import { Table } from '../components/Table';
import { LinkButton } from '../components/LinkButton';
import { Alert } from '../components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from '../components/Card';

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/roles');
      const data: Role[] | { error: string } = await res.json();
      if (res.ok && Array.isArray(data)) {
        setRoles(data);
        setError(null);
      } else {
        setError((data as { error: string }).error || 'Gagal memuat data peran');
      }
    } catch (err) {
      setError('Gagal memuat data peran');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus peran ini?')) {
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
          setError(data.error || 'Gagal menghapus peran');
        }
      } catch (err) {
        setError('Gagal menghapus peran');
      }
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const columns = [
    { key: 'idrole', label: 'ID' },
    { key: 'nama_role', label: 'Nama Peran' },
  ];

  return (
    <div className="space-y-6">

      <div className="bg-gradient-to-r from-[#00A69F] to-[#0D9488] rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Manajemen Peran</h1>
              <p className="text-teal-100 mt-1">Kelola peran pengguna dan hak akses</p>
            </div>
          </div>
          <LinkButton href="/role/add" variant="secondary" size="lg" icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }>
            Tambah Peran
          </LinkButton>
        </div>
      </div>

      {error && (
        <Alert variant="danger" title="Kesalahan" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card padding="none">
        <CardHeader className="p-6">
          <CardTitle>All Roles</CardTitle>
          <CardDescription>A list of all roles in the system</CardDescription>
        </CardHeader>
        <CardBody>
          <Table
            data={roles}
            columns={columns}
            onDelete={handleDelete}
            editPath="/role/edit"
            idKey="idrole"
            loading={loading}
          />
        </CardBody>
      </Card>
    </div>
  );
}