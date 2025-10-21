// app/role/edit/[id]/page.tsx
'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { FormInput } from '@/app/components/FormInput';
import { Button } from '@/app/components/Button';
import { LinkButton } from '@/app/components/LinkButton';
import { SelectInput } from '@/app/components/SelectInput';
import { Satuan } from '@/app/lib/type';

export default function EditBarang({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [nama, setNama] = useState<string>('');
    const [satuans, setSatuans] = useState<Satuan[]>([]);
    const [idsatuan, setIdSatuan] = useState<string>('') ;
    const [jenis, setJenis] = useState<string>('');
    const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  const statusOptions = [
    { id: 1, label: 'Baik' },
    { id: 0, label: 'Rusak' },
  ];

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const res = await fetch(`/api/barangs/${id}`); 
        // Sesuaikan dengan rute dinamis [id]
        const data = await res.json();
        if (res.ok) {
          setNama(data.nama);
          setJenis(data.jenis);
          setIdSatuan(data.idsatuan);
          setStatus(data.status);
        } else {
          setError(data.error || 'Failed to fetch barang');
        }
      } catch (err) {
        setError('Failed to fetch barang');
      }
    };

    fetchBarang();
  }, [id]);

  useEffect(() => {
      const fetchSatuans = async () => {
        try {
          const res = await fetch('/api/satuans');
          const data = await res.json();
          console.log(data);
          if (res.ok) {
            setSatuans(data);
          } else {
            setError(data.error || 'Failed to fetch satuan');
          }
        } catch (err) {
          setError('Failed to fetch satuan');
        }
      };
      fetchSatuans();
    }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/barangs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idbarang: Number(id), nama, status, jenis, idsatuan : Number(idsatuan) }),
      });
      if (res.ok) {
        router.push('/barang');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update barang');
      }
    } catch (err) {
      setError('Failed to update barang');
    }
  };

  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="mt-30 p-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Edit Peran</h1>
      <form onSubmit={handleSubmit}>
              <FormInput label="Nama Barang" type="text" value={nama} onChange={setNama} required />
              <FormInput label="Jenis Barang" type="text" value={jenis} onChange={setJenis} required />
              <SelectInput
                        label="Satuan"
                        value={idsatuan}
                        onChange={setIdSatuan}
                        options={satuans || []}
                        optionKey="idsatuan"
                        optionLabel="nama_satuan"
                        placeholder="Pilih Satuan"
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
                                <LinkButton href="/role" variant="primary" size="medium">
                                Kembali
                                </LinkButton>
                              </div>
                        <Button type="submit">Simpan</Button>
                      </div>
            </form>
    </div>
  );
}
