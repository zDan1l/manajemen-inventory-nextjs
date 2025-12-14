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
          setError(data.error || 'Gagal memuat pengguna');
        }
      } catch (err) {
        setError('Gagal memuat pengguna');
      }
    };

    const fetchRoles = async () => {
      try {
        const res = await fetch('/api/roles');
        const data = await res.json();
        if (res.ok) {
          setRoles(data);
        } else {
          setError(data.error || 'Gagal memuat peran');
        }
      } catch (err) {
        setError('Gagal memuat peran');
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
        setError(data.error || 'Gagal memperbarui pengguna');
      }
    } catch (err) {
      setError('Gagal memperbarui pengguna');
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
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="bg-gradient-to-r from-[#00A69F] to-[#0D9488] rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Edit Pengguna</h1>
        <p className="text-white/90">Perbarui informasi pengguna</p>
      </div>

      {error && (
        <Alert variant="danger" title="Kesalahan" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informasi Pengguna</CardTitle>
            <CardDescription>Masukkan detail untuk memperbarui pengguna</CardDescription>
          </CardHeader>

          <CardBody>
            <div className="space-y-6">
              <FormInput
                label="Nama Pengguna"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Masukkan nama pengguna"
                helper="Nama pengguna harus unik"
              />

              <FormInput
                label="Kata Sandi Baru"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Biarkan kosong untuk tetap menggunakan kata sandi saat ini"
                helper="Isi hanya jika ingin mengubah kata sandi"
              />

              <SelectInput
                label="Peran"
                value={idrole}
                onChange={(e) => setIdrole(e.target.value)}
                options={roleOptions}
                placeholder="Pilih peran (Opsional)"
                helper="Tetapkan peran untuk pengguna ini"
              />
            </div>
          </CardBody>

          <CardFooter>
            <div className="flex gap-3">
              <LinkButton href="/user" variant="outline" size="lg">
                Batal
              </LinkButton>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
              >
                Perbarui Pengguna
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}