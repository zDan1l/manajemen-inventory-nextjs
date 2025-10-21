// app/users/edit/[id]/page.tsx
'use client'; // Tetap menggunakan client-side rendering
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Margin, User } from '@/app/lib/type'; // Pastikan path sesuai
import { FormInput } from '@/app/components/FormInput';
import { SelectInput } from '@/app/components/SelectInput';
import { Button } from '@/app/components/Button';
import { LinkButton } from '@/app/components/LinkButton';

export default function EditUser({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // Unwrap params menggunakan React.use()
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
    const fetchMargin = async () => {
      try {
        const res = await fetch(`/api/margins/${id}`); 
        // Sesuaikan dengan rute dinamis [id]
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setIduser(data.iduser);
          setPersen(data.persen);
          setStatus(data.status);
        } else {
          setError(data.error || 'Failed to fetch margin');
        }
      } catch (err) {
        setError('Failed to fetch margin');
      }

    };

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
    fetchMargin();
  }, [id]); // Dependency diubah ke id yang sudah di-unwrap

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/margins`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idmargin_penjualan: Number(id),
          iduser: Number(iduser),
          persen: Number(persen),
          status: Number(status),
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
    }
  };

  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="mt-30 p-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Edit Margin</h1>
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