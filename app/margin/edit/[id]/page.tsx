'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { FormInput } from '@/app/components/FormInput';
import { SelectInput } from '@/app/components/SelectInput';
import { Button } from '@/app/components/Button';
import { LinkButton } from '@/app/components/LinkButton';
import { Alert } from '@/app/components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '@/app/components/Card';
import { User } from '@/app/lib/type';

export default function EditMargin({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [persen, setPersen] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [iduser, setIdUser] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const router = useRouter();

  const statusOptions = [
    { value: 1, label: 'Aktif' },
    { value: 0, label: 'Tidak Aktif' },
  ];

  useEffect(() => {
    const fetchMargin = async () => {
      try {
        const res = await fetch(`/api/margins/${id}`);
        const data = await res.json();
        if (res.ok) {
          setPersen(data.persen.toString());
          setIdUser(data.iduser.toString());
          setStatus(data.status.toString());
        } else {
          setError(data.error || 'Gagal memuat margin');
        }
      } catch (err) {
        setError('Gagal memuat margin');
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        if (res.ok) {
          setUsers(data);
        } else {
          setError(data.error || 'Gagal memuat pengguna');
        }
      } catch (err) {
        setError('Gagal memuat pengguna');
      } finally {
        setLoadingData(false);
      }
    };

    fetchMargin();
    fetchUsers();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/margins', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          idmargin_penjualan: Number(id),
          iduser: Number(iduser), 
          persen: Number(persen), 
          status: Number(status) 
        }),
      });
      
      if (res.ok) {
        router.push('/margin');
      } else {
        const data = await res.json();
        setError(data.error || 'Gagal memperbarui margin');
      }
    } catch (err) {
      setError('Gagal memperbarui margin');
    } finally {
      setLoading(false);
    }
  };

  const userOptions = users.map(u => ({
    value: u.iduser,
    label: u.username
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
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00A69F] to-[#0D9488] rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Edit Margin</h1>
        <p className="text-white/90">Perbarui informasi margin penjualan</p>
      </div>

      {error && (
        <Alert variant="danger" title="Kesalahan" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informasi Margin</CardTitle>
            <CardDescription>Masukkan detail untuk memperbarui margin</CardDescription>
          </CardHeader>
          
          <CardBody>
            <div className="space-y-6">
              <FormInput 
                label="Persentase" 
                type="number" 
                value={persen} 
                onChange={(e) => setPersen(e.target.value)} 
                required 
                placeholder="Masukkan persentase"
                helper="Persentase margin (contoh: 10 untuk 10%)"
                step="0.01"
                min="0"
                max="100"
              />

              <SelectInput
                label="Pengguna"
                value={iduser}
                onChange={(e) => setIdUser(e.target.value)}
                options={userOptions}
                placeholder="Pilih pengguna"
                required
                helper="Pengguna yang bertanggung jawab atas pengaturan margin ini"
              />

              <SelectInput
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={statusOptions}
                placeholder="Pilih status"
                required
                helper="Apakah margin ini sedang aktif"
              />
            </div>
          </CardBody>
          
          <CardFooter>
            <div className="flex gap-3">
              <LinkButton href="/margin" variant="outline" size="lg">Batal</LinkButton>
              <Button type="submit" variant="primary" size="lg" loading={loading} icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }>Perbarui Margin</Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
