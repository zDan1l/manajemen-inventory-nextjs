'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '@/app/lib/type';
import { FormInput } from '@/app/components/FormInput';
import { SelectInput } from '@/app/components/SelectInput';
import { Button } from '@/app/components/Button';
import { LinkButton } from '@/app/components/LinkButton';
import { Alert } from '@/app/components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '@/app/components/Card';

export default function EditUser({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [idrole, setIdrole] = useState<string>('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${id}`);
        const data = await res.json();
        if (res.ok) {
          setUsername(data.username);
          setIdrole(data.idrole ? data.idrole.toString() : '');
        } else {
          setError(data.error || 'Failed to fetch user');
        }
      } catch (err) {
        setError('Failed to fetch user');
      }
    };

    const fetchRoles = async () => {
      try {
        const res = await fetch('/api/roles');
        const data = await res.json();
        if (res.ok) {
          setRoles(data);
        } else {
          setError(data.error || 'Failed to fetch roles');
        }
      } catch (err) {
        setError('Failed to fetch roles');
      } finally {
        setLoadingData(false);
      }
    };

    fetchUser();
    fetchRoles();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/users`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          iduser: Number(id),
          username,
          password: password || undefined,
          idrole: idrole ? parseInt(idrole) : null,
        }),
      });
      
      if (res.ok) {
        router.push('/user');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update user');
      }
    } catch (err) {
      setError('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = roles.map(role => ({
    value: role.idrole,
    label: role.nama_role
  }));

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Edit User</h1>
        <p className="text-sm text-gray-600 mt-1">Update user account information</p>
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
            <CardTitle>User Information</CardTitle>
            <CardDescription>Update the user details below</CardDescription>
          </CardHeader>
          
          <CardBody>
            <div className="space-y-6">
              <FormInput 
                label="Username" 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                placeholder="Enter username"
                helper="Username must be unique"
              />
              
              <FormInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                helper="Only fill if you want to change the password"
              />
              
              <SelectInput
                label="Role"
                value={idrole}
                onChange={(e) => setIdrole(e.target.value)}
                options={roleOptions}
                placeholder="Select a role (Optional)"
                helper="Assign a role to this user"
              />
            </div>
          </CardBody>
          
          <CardFooter>
            <div className="flex gap-3">
              <LinkButton href="/user" variant="outline">
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
                Update User
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
