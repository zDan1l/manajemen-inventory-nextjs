'use client';
import { useEffect, useState, use } from 'react';
import { LinkButton } from '@/app/components/LinkButton';
import { SelectInput } from '@/app/components/SelectInput';
import { FormInput } from '@/app/components/FormInput';
import { Button } from '@/app/components/Button';
import { useRouter } from 'next/navigation';

export default function EditSatuan({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [nama_vendor, setNamaVendor] = useState<string>('');
  const [badan_hukum, setBadanHukum] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await fetch(`/api/vendors/${id}`); 
        // Sesuaikan dengan rute dinamis [id]
        const data = await res.json();
        if (res.ok) {
          setNamaVendor(data.nama_vendor);
          setBadanHukum(data.badan_hukum);
          setStatus(data.status ? data.status : '');
        } else {
          setError(data.error || 'Failed to fetch vendor');
        }
      } catch (err) {
        setError('Failed to fetch vendor');
      }
    };
    fetchVendor();
  }, [id]); 

  const statusOptions = [
    { id: '0', label: 'Dalam Kontrak' },
    { id: '1', label: 'Seleasi Kontrak' },
  ];
  const badanOptions = [
    { id: 'Y', label: 'Berbadan Hukum' },
    { id: 'N', label: 'Tidak Berbadan Hukum' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama_vendor || status === '') {
      setError('Nama vendor dan status wajib diisi');
      return;
    }

    try {
      const res = await fetch('/api/vendors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_vendor, badan_hukum , status, idvendor: Number(id)}),
      });
      if (res.ok) {
        router.push('/vendor');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to edit vendor');
      }
    } catch (err) {
      setError('Failed to add vendor');
    }
  };

  return (
    <div className="mt-30 p-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Edit Vendor</h1>
      {error && <div className="text-red-600 mb-4">Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <FormInput label="Nama Vendor" type="text" value={nama_vendor} onChange={setNamaVendor} required />
        <SelectInput
          label="Badan Hukum"
          value={badan_hukum}
          onChange={setBadanHukum}
          options={badanOptions}
          optionKey="id"
          optionLabel="label"
          placeholder="Pilih Status"
          required
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
        <div className="flex gap-2 mt-4">
          <LinkButton href="/vendor" variant="primary" size="medium">
            Kembali
          </LinkButton>
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </div>
  );
}