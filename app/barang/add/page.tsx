'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormInput } from '../../components/FormInput';
import { Button } from '../../components/Button';
import { LinkButton } from '@/app/components/LinkButton';
import { SelectInput } from '@/app/components/SelectInput';
import { Alert } from '@/app/components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '@/app/components/Card';
import { Satuan } from '@/app/lib/type';

export default function AddBarang() {
  const [nama, setNama] = useState<string>('');
  const [satuans, setSatuans] = useState<Satuan[]>([]);
  const [idsatuan, setIdSatuan] = useState<string>('');
  const [jenis, setJenis] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const statusOptions = [
    { value: 1, label: 'Baik' },
    { value: 0, label: 'Rusak' },
  ];

  useEffect(() => {
    const fetchSatuans = async () => {
      try {
        const res = await fetch('/api/satuans');
        const data = await res.json();
        if (res.ok) {
          setSatuans(data);
        } else {
          setError(data.error || 'Gagal memuat data satuan');
        }
      } catch (err) {
        setError('Gagal memuat data satuan');
      }
    };
    fetchSatuans();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/barangs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nama, 
          idsatuan: Number(idsatuan), 
          jenis, 
          status: Number(status) 
        }),
      });
      
      if (res.ok) {
        router.push('/barang');
      } else {
        const data = await res.json();
        setError(data.error || 'Gagal menambahkan barang');
      }
    } catch (err) {
      setError('Gagal menambahkan barang');
    } finally {
      setLoading(false);
    }
  };

  const satuanOptions = satuans.map(s => ({
    value: s.idsatuan,
    label: s.nama_satuan
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00A69F] to-[#0D9488] rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Tambah Barang</h1>
            <p className="text-blue-100 mt-1">Buat item inventori baru</p>
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
            <CardTitle>Informasi Barang</CardTitle>
            <CardDescription>Masukkan detail untuk item inventori baru</CardDescription>
          </CardHeader>
          
          <CardBody>
            <div className="space-y-6">
              <FormInput 
                label="Nama Barang" 
                type="text" 
                value={nama} 
                onChange={(e) => setNama(e.target.value)} 
                required 
                placeholder="Masukkan nama barang"
                helper="Nama deskriptif untuk barang"
              />

              <FormInput 
                label="Jenis Barang" 
                type="text" 
                value={jenis} 
                onChange={(e) => setJenis(e.target.value)} 
                required 
                placeholder="Contoh: A, B, C"
                helper="Kode klasifikasi atau kategori"
              />

              <SelectInput
                label="Satuan"
                value={idsatuan}
                onChange={(e) => setIdSatuan(e.target.value)}
                options={satuanOptions}
                placeholder="Pilih satuan pengukuran"
                required
                helper="Pilih satuan pengukuran"
              />

              <SelectInput
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={statusOptions}
                placeholder="Pilih kondisi"
                required
                helper="Kondisi barang saat ini"
              />
            </div>
          </CardBody>
          
          <CardFooter>
            <div className="flex gap-3">
              <LinkButton href="/barang" variant="outline">
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
