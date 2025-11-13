'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { FormInput } from '@/app/components/FormInput';
import { SelectInput } from '@/app/components/SelectInput';
import { Button } from '@/app/components/Button';
import { LinkButton } from '@/app/components/LinkButton';
import { Alert } from '@/app/components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '@/app/components/Card';
import { User } from '@/app/lib/type';

export default function EditMargin({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [persen, setPersen] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [iduser, setIdUser] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const router = useRouter();

  const statusOptions = [
    { value: 1, label: 'Active' },
    { value: 0, label: 'Inactive' },
  ];

  useEffect(() => {
    const fetchMargin = async () => {
      try {
        const res = await fetch(`/api/margins/${id}`);
        const data = await res.json();
        if (res.ok) {
          setPersen(data.persen.toString());
          setIdUser(data.iduser.toString());
          setStatus(data.status.toString());
        } else {
          setError(data.error || 'Failed to fetch margin');
        }
      } catch (err) {
        setError('Failed to fetch margin');
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        if (res.ok) {
          setUsers(data);
        } else {
          setError(data.error || 'Failed to fetch users');
        }
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoadingData(false);
      }
    };

    fetchMargin();
    fetchUsers();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/margins', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          idmargin_penjualan: Number(id),
          iduser: Number(iduser), 
          persen: Number(persen), 
          status: Number(status) 
        }),
      });
      
      if (res.ok) {
        router.push('/margin');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update margin');
      }
    } catch (err) {
      setError('Failed to update margin');
    } finally {
      setLoading(false);
    }
  };

  const userOptions = users.map(u => ({
    value: u.iduser,
    label: u.username
  }));

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading margin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Edit Sales Margin</h1>
        <p className="text-sm text-gray-600 mt-1">Update sales margin configuration</p>
      </div>

      {error && (
        <Alert variant="danger" title="Error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Margin Information</CardTitle>
            <CardDescription>Update the margin details below</CardDescription>
          </CardHeader>
          
          <CardBody>
            <div className="space-y-6">
              <FormInput 
                label="Margin Percentage" 
                type="number" 
                value={persen} 
                onChange={(e) => setPersen(e.target.value)} 
                required 
                placeholder="Enter percentage"
                helper="Margin percentage (e.g., 10 for 10%)"
                step="0.01"
                min="0"
                max="100"
              />

              <SelectInput
                label="User"
                value={iduser}
                onChange={(e) => setIdUser(e.target.value)}
                options={userOptions}
                placeholder="Select user"
                required
                helper="User responsible for this margin setting"
              />

              <SelectInput
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={statusOptions}
                placeholder="Select status"
                required
                helper="Whether this margin is currently active"
              />
            </div>
          </CardBody>
          
          <CardFooter>
            <div className="flex gap-3">
              <LinkButton href="/margin" variant="outline">Cancel</LinkButton>
              <Button type="submit" variant="primary" loading={loading} icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }>Update Margin</Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
