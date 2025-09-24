// app/role/edit/[id]/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '@/app/lib/type';
import { FormInput } from '@/app/components/FormInput';
import { Button } from '@/app/components/Button';

export default function EditRole({ params }: { params: { id: string } }) {
  const [nama_role, setNamaRole] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      fetch(`/api/role/${params.id}`)
        .then((res) => res.json())
        .then((data: Role | { error: string }) => {
          if ('error' in data) {
            setError(data.error);
          } else {
            setNamaRole(data.nama_role);
          }
        })
        .catch(() => setError('Failed to fetch role'));
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/role', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idrole: Number(params.id), nama_role }),
      });
      if (res.ok) {
        router.push('/role');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update role');
      }
    } catch (err) {
      setError('Failed to update role');
    }
  };

  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Edit Peran</h1>
      <form onSubmit={handleSubmit}>
        <FormInput label="Nama Peran" type="text" value={nama_role} onChange={setNamaRole} required />
        <Button type="submit">Simpan</Button>
      </form>
    </div>
  );
}
