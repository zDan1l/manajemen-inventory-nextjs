// app/role/add/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormInput } from '../../components/FormInput';
import { Button } from '../../components/Button';
import { LinkButton } from '@/app/components/LinkButton';

export default function AddRole() {
  const [nama_role, setNamaRole] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_role }),
      });
      console.log(res);
      if (res.ok) {
        router.push('/role');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to add role');
      }
    } catch (err) {
      setError('Failed to add role');
    }
  };

  return (
    <div className="mt-30 p-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Tambah Peran</h1>
      {error && <div className="text-red-600 mb-4">Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <FormInput label="Nama Peran" type="text" value={nama_role} onChange={setNamaRole} required />
        <div className="flex">
                  <div className="flex gap-2">
                          <LinkButton href="/role" variant="primary" size="medium">
                          Kembali
                          </LinkButton>
                        </div>
                  <Button type="submit">Simpan</Button>
                </div>
      </form>
    </div>
  );
}
