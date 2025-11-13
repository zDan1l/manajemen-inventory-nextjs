// app/users/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { User} from '@/app/lib/type';
import { Table } from '@/app/components/Table';
import { LinkButton } from '../components/LinkButton';
import { Alert } from '../components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from '../components/Card';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      const data: User[] | { error: string } = await res.json();
      if (res.ok && Array.isArray(data)) {
        setUsers(data);
        setError(null);
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
          setError(data.error || 'Failed to delete user');
        }
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { key: 'iduser', label: 'ID' },
    { key: 'username', label: 'Username' },
    { key: 'role_name', label: 'Role' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="text-sm text-gray-600 mt-1">Manage system users and their roles</p>
        </div>
        <LinkButton href="/user/add" variant="primary" icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        }>
          Add User
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
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all users in the system including their name and role.</CardDescription>
        </CardHeader>
        <CardBody>
          <Table
            data={users}
            columns={columns}
            onDelete={handleDelete}
            editPath="/user/edit"
            idKey="iduser"
            loading={loading}
          />
        </CardBody>
      </Card>
    </div>
  );
}
