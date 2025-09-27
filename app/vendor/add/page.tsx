'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormInput } from '../../components/FormInput';
import { Button } from '../../components/Button';
import { LinkButton } from '@/app/components/LinkButton';
import { SelectInput } from '@/app/components/SelectInput';

export default function AddSatuan() {
  const [nama_satuan, setNamaSatuan] = useState<string>('');
  const [status, setStatus] = useState<number | ''>(''); // Default ke '' sampai ada pilihan
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Opsi status dengan nilai angka
  const statusOptions = [
    { id: 0, label: 'Tidak Bisa Dipakai' },
    { id: 1, label: 'Bisa Dipakai' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama_satuan || status === '') {
      setError('Nama satuan dan status wajib diisi');
      return;
    }

    try {
      const res = await fetch('/api/satuans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_satuan, status: Number(status) }),
      });
      console.log('Response:', res);
      if (res.ok) {
        router.push('/satuan');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to add satuan');
      }
    } catch (err) {
      setError('Failed to add satuan');
    }
  };

  return (
    <div className="mt-30 p-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Tambah Satuan</h1>
      {error && <div className="text-red-600 mb-4">Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <FormInput label="Nama Satuan" type="text" value={nama_satuan} onChange={setNamaSatuan} required />
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