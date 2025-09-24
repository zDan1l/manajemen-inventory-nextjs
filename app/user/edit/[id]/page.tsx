// app/users/edit/[id]/page.tsx
'use client'; // Tetap menggunakan client-side rendering
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '@/app/lib/type'; // Pastikan path sesuai
import { FormInput } from '@/app/components/FormInput';
import { SelectInput } from '@/app/components/SelectInput';
import { Button } from '@/app/components/Button';

export default function EditUser({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // Unwrap params menggunakan React.use()
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [idrole, setIdrole] = useState<string>('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${id}`); 
        // Sesuaikan dengan rute dinamis [id]
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
      }
    };

    fetchUser();
    fetchRoles();
  }, [id]); // Dependency diubah ke id yang sudah di-unwrap

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    }
  };

  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Edit Pengguna</h1>
      <form onSubmit={handleSubmit}>
        <FormInput label="Username" type="text" value={username} onChange={setUsername} required />
        <FormInput
          label="Password (Kosongkan jika tidak diubah)"
          type="password"
          value={password}
          onChange={setPassword}
          required={false}
        />
        <SelectInput
          label="Peran"
          value={idrole}
          onChange={setIdrole}
          options={roles}
          optionKey="idrole"
          optionLabel="nama_role"
          placeholder="Pilih Peran (Opsional)"
        />
        <Button type="submit">Simpan</Button>
      </form>
    </div>
  );
}