'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormInput } from '../../components/FormInput';
import { Button } from '../../components/Button';
import { LinkButton } from '@/app/components/LinkButton';
import { Alert } from '@/app/components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '@/app/components/Card';

export default function AddRole() {
  const [nama_role, setNamaRole] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_role }),
      });

      if (res.ok) {
        router.push('/role');
      } else {
        const data = await res.json();
        setError(data.error || 'Gagal menambahkan peran');
      }
    } catch (err) {
      setError('Gagal menambahkan peran');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      <div className="bg-gradient-to-r from-[#00A69F] to-[#0D9488] rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Tambah Peran</h1>
            <p className="text-teal-100">Buat peran pengguna baru</p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="danger" title="Kesalahan" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informasi Peran</CardTitle>
            <CardDescription>Masukkan detail untuk peran baru</CardDescription>
          </CardHeader>

          <CardBody>
            <div className="space-y-6">
              <FormInput
                label="Nama Peran"
                type="text"
                value={nama_role}
                onChange={(e) => setNamaRole(e.target.value)}
                required
                placeholder="Masukkan nama peran"
                helper="Pilih nama yang deskriptif untuk peran ini"
              />
            </div>
          </CardBody>

          <CardFooter>
            <div className="flex gap-3">
              <LinkButton href="/role" variant="outline" size="lg">
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
                Simpan Peran
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}