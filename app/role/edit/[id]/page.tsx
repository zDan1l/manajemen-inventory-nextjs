'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { FormInput } from '@/app/components/FormInput';
import { Button } from '@/app/components/Button';
import { LinkButton } from '@/app/components/LinkButton';
import { Alert } from '@/app/components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '@/app/components/Card';

export default function EditRole({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [nama_role, setNamaRole] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch(`/api/roles/${id}`);
        const data = await res.json();
        if (res.ok) {
          setNamaRole(data.nama_role);
        } else {
          setError(data.error || 'Gagal memuat peran');
        }
      } catch (err) {
        setError('Gagal memuat peran');
      } finally {
        setLoadingData(false);
      }
    };

    fetchRole();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/roles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idrole: Number(id), nama_role }),
      });

      if (res.ok) {
        router.push('/role');
      } else {
        const data = await res.json();
        setError(data.error || 'Gagal memperbarui peran');
      }
    } catch (err) {
      setError('Gagal memperbarui peran');
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-white mb-2">Edit Peran</h1>
        <p className="text-white/90">Perbarui informasi peran</p>
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
            <CardDescription>Masukkan detail untuk memperbarui peran</CardDescription>
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
                helper="Nama deskriptif untuk peran ini"
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
                Perbarui Peran
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}