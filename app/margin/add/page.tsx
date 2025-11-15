'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormInput } from '../../components/FormInput';
import { Button } from '../../components/Button';
import { LinkButton } from '@/app/components/LinkButton';
import { SelectInput } from '@/app/components/SelectInput';
import { Alert } from '@/app/components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '@/app/components/Card';
import { User } from '@/app/lib/type';

export default function AddMargin() {
  const [users, setUser] = useState<User[]>([]);
  const [iduser, setIduser] = useState<string>('');
  const [persen, setPersen] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const statusOptions = [
    { value: 1, label: 'Dipakai' },
    { value: 0, label: 'Tidak Dipakai' },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          setError(data.error || 'Gagal memuat data pengguna');
        }
      } catch (err) {
        setError('Gagal memuat data pengguna');
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
        setError(data.error || 'Gagal menambahkan margin');
      }
    } catch (err) {
      setError('Gagal menambahkan margin');
    } finally {
      setLoading(false);
    }
  };

  const userOptions = users.map(u => ({
    value: u.iduser,
    label: u.username
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00A69F] to-[#0D9488] rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Tambah Margin</h1>
            <p className="text-pink-100 mt-1">Buat konfigurasi margin penjualan baru</p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" title="Kesalahan" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Form Card */}
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informasi Margin</CardTitle>
            <CardDescription>Masukkan detail untuk konfigurasi margin baru</CardDescription>
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
                onChange={(e) => setIduser(e.target.value)}
                options={userOptions}
                placeholder="Pilih pengguna"
                required
                helper="Pengguna yang membuat margin ini"
              />

              <SelectInput
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={statusOptions}
                placeholder="Pilih status"
                required
                helper="Apakah margin ini sedang digunakan"
              />
            </div>
          </CardBody>
          
          <CardFooter>
            <div className="flex gap-3">
              <LinkButton href="/margin" variant="outline">
                Batal
              </LinkButton>
              <Button 
                type="submit" 
                variant="primary" 
                loading={loading}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
              >
                Simpan
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
