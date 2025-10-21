// app/users/add/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '@/app/lib/type';
import { FormInput } from '@/app/components/FormInput';
import { SelectInput } from '@/app/components/SelectInput';
import { Button } from '@/app/components/Button';
import { LinkButton } from '@/app/components/LinkButton';

export default function AddUser() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [idrole, setIdrole] = useState<string>('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
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
      }
    };
    fetchRoles();
  }, []);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, idrole: idrole ? parseInt(idrole) : null }),
      });
      if (res.ok) {
        router.push('/user');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to add user');
      }
    } catch (err) {
      setError('Failed to add user');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-blue-200 border-2 border-black p-4">
        <h1 className="text-xl font-bold uppercase text-black">Tambah Pengguna</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-200 border-2 border-black p-3">
          <p className="font-bold text-red-800">Error: {error}</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-white border-2 border-black p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput 
            label="Username" 
            type="text" 
            value={username} 
            onChange={setUsername} 
            required 
          />
          
          <FormInput 
            label="Password" 
            type="password" 
            value={password} 
            onChange={setPassword} 
            required 
          />
          
          <SelectInput
            label="Peran"
            value={idrole}
            onChange={setIdrole}
            options={roles || []}
            optionKey="idrole"
            optionLabel="nama_role"
            placeholder="Pilih Peran (Opsional)"
          />
          
          <div className="flex gap-2 pt-4">
            <LinkButton href="/user" variant="primary" size="medium">
              Kembali
            </LinkButton>
            <Button type="submit" variant="success">
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
