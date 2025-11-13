'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { FormInput } from '@/app/components/FormInput';
import { Button } from '@/app/components/Button';
import { LinkButton } from '@/app/components/LinkButton';
import { Alert } from '@/app/components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '@/app/components/Card';

export default function EditRole({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [nama_role, setNamaRole] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch(`/api/roles/${id}`);
        const data = await res.json();
        if (res.ok) {
          setNamaRole(data.nama_role);
        } else {
          setError(data.error || 'Failed to fetch role');
        }
      } catch (err) {
        setError('Failed to fetch role');
      } finally {
        setLoadingData(false);
      }
    };

    fetchRole();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/roles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idrole: Number(id), nama_role }),
      });
      
      if (res.ok) {
        router.push('/role');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update role');
      }
    } catch (err) {
      setError('Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading role data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Edit Role</h1>
        <p className="text-sm text-gray-600 mt-1">Update role information</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" title="Error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Form Card */}
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Role Information</CardTitle>
            <CardDescription>Update the role details below</CardDescription>
          </CardHeader>
          
          <CardBody>
            <div className="space-y-6">
              <FormInput 
                label="Role Name" 
                type="text" 
                value={nama_role} 
                onChange={(e) => setNamaRole(e.target.value)} 
                required 
                placeholder="Enter role name"
                helper="A descriptive name for this role"
              />
            </div>
          </CardBody>
          
          <CardFooter>
            <div className="flex gap-3">
              <LinkButton href="/role" variant="outline">
                Cancel
              </LinkButton>
              <Button 
                type="submit" 
                variant="primary" 
                loading={loading}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
              >
                Update Role
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
