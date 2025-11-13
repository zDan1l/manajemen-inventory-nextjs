'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormInput } from '../../components/FormInput';
import { Button } from '../../components/Button';
import { LinkButton } from '@/app/components/LinkButton';
import { SelectInput } from '@/app/components/SelectInput';
import { Alert } from '@/app/components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '@/app/components/Card';
import { User } from '@/app/lib/type';

export default function AddMargin() {
  const [users, setUser] = useState<User[]>([]);
  const [iduser, setIduser] = useState<string>('');
  const [persen, setPersen] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const statusOptions = [
    { value: 1, label: 'Dipakai' },
    { value: 0, label: 'Tidak Dipakai' },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          setError(data.error || 'Failed to fetch users');
        }
      } catch (err) {
        setError('Failed to fetch users');
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/margins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          iduser: Number(iduser), 
          persen: Number(persen), 
          status: Number(status),
        }),
      });
      
      if (res.ok) {
        router.push('/margin');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to add margin');
      }
    } catch (err) {
      setError('Failed to add margin');
    } finally {
      setLoading(false);
    }
  };

  const userOptions = users.map(u => ({
    value: u.iduser,
    label: u.username
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Add Margin</h1>
        <p className="text-sm text-gray-600 mt-1">Create a new sales margin configuration</p>
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
            <CardTitle>Margin Information</CardTitle>
            <CardDescription>Enter the details for the new margin configuration</CardDescription>
          </CardHeader>
          
          <CardBody>
            <div className="space-y-6">
              <FormInput 
                label="Percentage" 
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
                onChange={(e) => setIduser(e.target.value)}
                options={userOptions}
                placeholder="Select user"
                required
                helper="User who created this margin"
              />

              <SelectInput
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={statusOptions}
                placeholder="Select status"
                required
                helper="Whether this margin is currently in use"
              />
            </div>
          </CardBody>
          
          <CardFooter>
            <div className="flex gap-3">
              <LinkButton href="/margin" variant="outline">
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
                Save Margin
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
