'use client';
import { useEffect, useState } from 'react';
import { Vendor } from '@/app/lib/type';
import { Table } from '../components/Table';
import { LinkButton } from '../components/LinkButton';
import { map } from 'zod';

export default function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendor = async () => {
    try {
      const res = await fetch('/api/vendors');
      const data: Vendor[] | { error: string } = await res.json();
      if (res.ok && Array.isArray(data)) {
        // Memetakan status ke string sebelum set state
        const mappedVendor = data.map((vendor) => ({
          ...vendor,
          status: mapStatusToString(Number(vendor.status)),
          badan_hukum : mapBadanToString(vendor.badan_hukum),
        }));
        setVendors(mappedVendor);
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
      '0': 'Dalam Kontrak',
      '1': 'Selesai Kontrak',
    };
    return statusMap[status] || 'Unknown'; // Fallback jika status tidak dikenali
  };

  // Fungsi untuk memetakan status numerik ke string
  const mapBadanToString = (badan_hukum: string): string => {
    const badanMap: { [key: string]: string } = {
      'Y': 'Berbadan Hukum',
      'N': 'Tidak Berbadan Hukum',
    };
    return badanMap[badan_hukum] || 'Unknown'; // Fallback jika status tidak dikenali
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      try {
        const res = await fetch('/api/vendors', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idvendor: id }),
        });
        if (res.ok) {
          fetchVendor();
        } else {
          const data = await res.json();
          alert(data.error || 'Failed to delete Vendor');
        }
      } catch (err) {
        alert('Failed to delete Vendor');
      }
    }
  };

  useEffect(() => {
    fetchVendor();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  const columns = [
    { key: 'idvendor', label: 'ID' },
    { key: 'nama_vendor', label: 'Nama Vendor' },
    { key: 'badan_hukum', label: 'Badan Hukum' },
    { key: 'status', label: 'Status' }, // Tetap menggunakan key 'status'
  ];

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Daftar Vendor</h1> {/* Perbaiki dari "Daftar Peran" */}
      <div className="mb-5 flex gap-4">
        <div className="flex items-center">
          <LinkButton href="/vendor/add" variant="primary" size="medium">
            Tambah Vendor
          </LinkButton>
        </div>
      </div>
      <Table
        data={vendors}
        columns={columns}
        onDelete={handleDelete}
        editPath="/vendor/edit"
        idKey="idvendor"
      />
      <div className="mt-4 flex gap-2">
        <LinkButton href="/" variant="primary" size="medium">
          Kembali
        </LinkButton>
      </div>
    </div>
  );
}