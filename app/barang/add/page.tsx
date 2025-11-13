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
          setError(data.error || 'Failed to fetch units');
        }
      } catch (err) {
        setError('Failed to fetch units');
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
        setError(data.error || 'Failed to add item');
      }
    } catch (err) {
      setError('Failed to add item');
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
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Add Item</h1>
        <p className="text-sm text-gray-600 mt-1">Create a new inventory item</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" title="Error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Form Card */}
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Item Information</CardTitle>
            <CardDescription>Enter the details for the new inventory item</CardDescription>
          </CardHeader>
          
          <CardBody>
            <div className="space-y-6">
              <FormInput 
                label="Item Name" 
                type="text" 
                value={nama} 
                onChange={(e) => setNama(e.target.value)} 
                required 
                placeholder="Enter item name"
                helper="A descriptive name for the item"
              />

              <FormInput 
                label="Item Type" 
                type="text" 
                value={jenis} 
                onChange={(e) => setJenis(e.target.value)} 
                required 
                placeholder="e.g., A, B, C"
                helper="Classification or category code"
              />

              <SelectInput
                label="Unit"
                value={idsatuan}
                onChange={(e) => setIdSatuan(e.target.value)}
                options={satuanOptions}
                placeholder="Select measurement unit"
                required
                helper="Choose the unit of measurement"
              />

              <SelectInput
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={statusOptions}
                placeholder="Select condition"
                required
                helper="Current condition of the item"
              />
            </div>
          </CardBody>
          
          <CardFooter>
            <div className="flex gap-3">
              <LinkButton href="/barang" variant="outline">
                Cancel
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
                Save Item
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
