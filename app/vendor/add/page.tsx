'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormInput } from '../../components/FormInput';
import { Button } from '../../components/Button';
import { LinkButton } from '@/app/components/LinkButton';
import { SelectInput } from '@/app/components/SelectInput';

export default function AddVendor() {
  const [nama_vendor, setNamaVendor] = useState<string>('');
  const [badan_hukum, setBadanHukum] = useState<string>('');
  const [status, setStatus] = useState<string>(''); // Default ke '' sampai ada pilihan
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_vendor : nama_vendor, badan_hukum : badan_hukum , status: status,  }),
      });
      console.log('Response:', res);
      if (res.ok) {
        router.push('/vendor');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to add vendor');
      }
    } catch (err) {
      setError('Failed to add vendor');
    }
  };

  return (
    <div className="mt-30 p-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Tambah Vendor</h1>
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
          <LinkButton href="/satuan" variant="primary" size="medium">
            Kembali
          </LinkButton>
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </div>
  );
}