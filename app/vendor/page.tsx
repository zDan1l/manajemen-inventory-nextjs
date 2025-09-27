'use client';
import { useEffect, useState } from 'react';
import { Satuan } from '@/app/lib/type';
import { Table } from '../components/Table';
import { LinkButton } from '../components/LinkButton';

export default function Satuans() {
  const [satuans, setSatuans] = useState<Satuan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSatuan = async () => {
    try {
      const res = await fetch('/api/satuans');
      const data: Satuan[] | { error: string } = await res.json();
      if (res.ok && Array.isArray(data)) {
        // Memetakan status ke string sebelum set state
        const mappedSatuans = data.map((satuan) => ({
          ...satuan,
          status: mapStatusToString(satuan.status), // Konversi status ke string
        }));
        setSatuans(mappedSatuans);
      } else {
        setError((data as { error: string }).error || 'Failed to fetch satuans');
      }
    } catch (err) {
      setError('Failed to fetch satuan');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk memetakan status numerik ke string
  const mapStatusToString = (status: number): string => {
    const statusMap: { [key: number]: string } = {
      0: 'Tidak Bisa Dipakai',
      1: 'Bisa Dipakai',
    };
    return statusMap[status] || 'Unknown'; // Fallback jika status tidak dikenali
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this Satuan?')) {
      try {
        const res = await fetch('/api/satuans', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idsatuan: id }),
        });
        if (res.ok) {
          fetchSatuan();
        } else {
          const data = await res.json();
          alert(data.error || 'Failed to delete Satuan');
        }
      } catch (err) {
        alert('Failed to delete Satuan');
      }
    }
  };

  useEffect(() => {
    fetchSatuan();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  const columns = [
    { key: 'idsatuan', label: 'ID' },
    { key: 'nama_satuan', label: 'Nama Satuan' },
    { key: 'status', label: 'Status' }, // Tetap menggunakan key 'status'
  ];

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Daftar Satuan</h1> {/* Perbaiki dari "Daftar Peran" */}
      <div className="mb-5 flex gap-4">
        <div className="flex items-center">
          <LinkButton href="/satuan/add" variant="primary" size="medium">
            Tambah Satuan
          </LinkButton>
        </div>
      </div>
      <Table
        data={satuans}
        columns={columns}
        onDelete={handleDelete}
        editPath="/satuan/edit"
        idKey="idsatuan"
      />
      <div className="mt-4 flex gap-2">
        <LinkButton href="/" variant="primary" size="medium">
          Kembali
        </LinkButton>
      </div>
    </div>
  );
}