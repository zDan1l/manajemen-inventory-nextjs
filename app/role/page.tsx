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
          setError(data.error || 'Failed to delete role');
        }
      } catch (err) {
        setError('Failed to delete role');
      }
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const columns = [
    { key: 'idrole', label: 'ID' },
    { key: 'nama_role', label: 'Role Name' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Roles</h1>
          <p className="text-sm text-gray-600 mt-1">Manage user roles and permissions</p>
        </div>
        <LinkButton href="/role/add" variant="primary" icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        }>
          Add Role
        </LinkButton>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" title="Error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Table Card */}
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
