'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ApiResponse } from '@/app/lib/type';
import { Button } from '@/app/components/Button';

interface Penerimaan {
  idpenerimaan: number;
  idpengadaan: number;
  created_at: string;
  user_iduser: number;
  username: string;
}

export default function DetailPenerimaanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [penerimaan, setPenerimaan] = useState<Penerimaan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPenerimaan();
  }, [id]);

  const fetchPenerimaan = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/penerimaans/${id}`);
      const result: ApiResponse<Penerimaan> = await res.json();

      if (result.status === 200 && result.data) {
        setPenerimaan(result.data);
      } else {
        setError('Failed to fetch penerimaan');
      }
    } catch (err) {
      setError('Error fetching penerimaan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!penerimaan) return <div className="p-6">Penerimaan tidak ditemukan</div>;

  return (
    <div className="space-y-6 max-w-2xl">

      <div className="bg-blue-200 border-2 border-black p-4">
        <h1 className="text-xl font-bold uppercase text-black">Detail Penerimaan</h1>
      </div>

      <div className="bg-white border-2 border-black p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold uppercase text-black mb-2">
              ID Penerimaan
            </label>
            <p className="p-3 border-2 border-gray-300 bg-gray-50 text-black">
              {penerimaan.idpenerimaan}
            </p>
          </div>
          <div>
            <label className="block text-sm font-bold uppercase text-black mb-2">
              ID Pengadaan
            </label>
            <p className="p-3 border-2 border-gray-300 bg-gray-50 text-black">
              {penerimaan.idpengadaan}
            </p>
          </div>
          <div>
            <label className="block text-sm font-bold uppercase text-black mb-2">
              User
            </label>
            <p className="p-3 border-2 border-gray-300 bg-gray-50 text-black">
              {penerimaan.username}
            </p>
          </div>
          <div>
            <label className="block text-sm font-bold uppercase text-black mb-2">
              Tanggal
            </label>
            <p className="p-3 border-2 border-gray-300 bg-gray-50 text-black">
              {new Date(penerimaan.created_at).toLocaleDateString('id-ID')}
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/penerimaan')}
          >
            Kembali
          </Button>
        </div>
      </div>
    </div>
  );
}