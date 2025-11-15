'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { FormInput } from '@/app/components/FormInput';
import { SelectInput } from '@/app/components/SelectInput';
import { Button } from '@/app/components/Button';
import { LinkButton } from '@/app/components/LinkButton';
import { Alert } from '@/app/components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '@/app/components/Card';
import { Satuan } from '@/app/lib/type';

export default function EditBarang({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [nama, setNama] = useState<string>('');
  const [satuans, setSatuans] = useState<Satuan[]>([]);
  const [idsatuan, setIdSatuan] = useState<string>('');
  const [jenis, setJenis] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const router = useRouter();

  const statusOptions = [
    { value: 1, label: 'Baik' },
    { value: 0, label: 'Rusak' },
  ];

  const jenisOptions = [
    { value: 'A', label: 'Alat Tulis Kantor' },
    { value: 'B', label: 'Perabotan Rumah Tangga' },
    { value: 'C', label: 'Elektronik' },
    { value: 'D', label: 'Makanan & Minuman' },
    { value: 'E', label: 'Aksesoris Elektronik' },
  ];

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const res = await fetch(`/api/barangs/${id}`);
        const data = await res.json();
        if (res.ok) {
          setNama(data.nama);
          setIdSatuan(data.idsatuan.toString());
          setJenis(data.jenis);
          setStatus(data.status.toString());
        } else {
          setError(data.error || 'Gagal memuat barang');
        }
      } catch (err) {
        setError('Gagal memuat barang');
      }
    };

    const fetchSatuans = async () => {
      try {
        const res = await fetch('/api/satuans');
        const data = await res.json();
        if (res.ok) {
          setSatuans(data);
        } else {
          setError(data.error || 'Gagal memuat satuan');
        }
      } catch (err) {
        setError('Gagal memuat satuan');
      } finally {
        setLoadingData(false);
      }
    };

    fetchBarang();
    fetchSatuans();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/barangs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          idbarang: Number(id),
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
        setError(data.error || 'Gagal memperbarui barang');
      }
    } catch (err) {
      setError('Gagal memperbarui barang');
    } finally {
      setLoading(false);
    }
  };

  const satuanOptions = satuans.map(s => ({
    value: s.idsatuan,
    label: s.nama_satuan
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
        <h1 className="text-3xl font-bold text-white mb-2">Edit Barang</h1>
        <p className="text-white/90">Perbarui informasi barang</p>
      </div>

      {error && (
        <Alert variant="danger" title="Kesalahan" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informasi Barang</CardTitle>
            <CardDescription>Masukkan detail untuk memperbarui barang</CardDescription>
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

              <SelectInput
                label="Jenis Barang"
                value={jenis}
                onChange={(e) => setJenis(e.target.value)}
                options={jenisOptions}
                placeholder="Pilih jenis barang"
                required
                helper="Kategori atau klasifikasi barang"
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
              <LinkButton href="/barang" variant="outline" size="lg">Batal</LinkButton>
              <Button type="submit" variant="primary" size="lg" loading={loading} icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }>Perbarui Barang</Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
