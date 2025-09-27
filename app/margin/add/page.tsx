// app/margin/add/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormInput } from '../../components/FormInput';
import { Button } from '../../components/Button';
import { LinkButton } from '@/app/components/LinkButton';
import { SelectInput } from '@/app/components/SelectInput';
import { User } from '@/app/lib/type';

export default function AddMargin() {
  const [users, setUser] = useState<User[]>([]);
  const [iduser, setIduser] = useState<string>('');
  const [persen, setPersen] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  const statusOptions = [
    { id: 1, label: 'Dipakai' },
    { id: 0, label: 'Tidak Pakai' },
  ];

  useEffect(() => {
      const fetchUser = async () => {
        try {
          const res = await fetch('/api/users');
          const data = await res.json();
          if (res.ok) {
            setUser(data);
          } else {
            setError(data.error || 'Failed to fetch user');
          }
        } catch (err) {
          setError('Failed to fetch user');
        }
      };
      fetchUser();
    }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    }
  };

  return (
    <div className="mt-30 p-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Tambah Margin</h1>
      {error && <div className="text-red-600 mb-4">Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <FormInput 
          label="Persen" 
          type="number" 
          value={persen} 
          onChange={(value) => setPersen(value)} 
          required 
        />
        <SelectInput
                  label="User"
                  value={iduser}
                  onChange={setIduser}
                  options={users || []}
                  optionKey="iduser"
                  optionLabel="username"
                  placeholder="Pilih User"
                />
        <SelectInput
          label="Status"
          value={status}
          onChange={setStatus}
          options={statusOptions}
          optionKey="id"
          optionLabel="label"
          placeholder="Pilih Status"
          required
        />
        <div className="flex">
                  <div className="flex gap-2">
                          <LinkButton href="/margin" variant="primary" size="medium">
                          Kembali
                          </LinkButton>
                        </div>
                  <Button type="submit">Simpan</Button>
                </div>
      </form>
    </div>
  );
}
