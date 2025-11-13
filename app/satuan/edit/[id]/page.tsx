'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { FormInput } from '@/app/components/FormInput';
import { SelectInput } from '@/app/components/SelectInput';
import { Button } from '@/app/components/Button';
import { LinkButton } from '@/app/components/LinkButton';
import { Alert } from '@/app/components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '@/app/components/Card';

export default function EditSatuan({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [nama_satuan, setNamaSatuan] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const router = useRouter();

  const statusOptions = [
    { value: 0, label: 'Tidak Bisa Dipakai' },
    { value: 1, label: 'Bisa Dipakai' },
  ];

  useEffect(() => {
    const fetchSatuan = async () => {
      try {
        const res = await fetch(`/api/satuans/${id}`);
        const data = await res.json();
        if (res.ok) {
          setNamaSatuan(data.nama_satuan);
          setStatus(data.status.toString());
        } else {
          setError(data.error || 'Failed to fetch unit');
        }
      } catch (err) {
        setError('Failed to fetch unit');
      } finally {
        setLoadingData(false);
      }
    };

    fetchSatuan();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/satuans', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          idsatuan: Number(id), 
          nama_satuan, 
          status: Number(status) 
        }),
      });
      
      if (res.ok) {
        router.push('/satuan');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update unit');
      }
    } catch (err) {
      setError('Failed to update unit');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading unit data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Edit Unit</h1>
        <p className="text-sm text-gray-600 mt-1">Update measurement unit information</p>
      </div>

      {error && (
        <Alert variant="danger" title="Error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Unit Information</CardTitle>
            <CardDescription>Update the unit details below</CardDescription>
          </CardHeader>
          
          <CardBody>
            <div className="space-y-6">
              <FormInput 
                label="Unit Name" 
                type="text" 
                value={nama_satuan} 
                onChange={(e) => setNamaSatuan(e.target.value)} 
                required 
                placeholder="e.g., Kilogram, Liter, Piece"
                helper="Enter the measurement unit name"
              />

              <SelectInput
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={statusOptions}
                placeholder="Select status"
                required
                helper="Choose whether this unit can be used"
              />
            </div>
          </CardBody>
          
          <CardFooter>
            <div className="flex gap-3">
              <LinkButton href="/satuan" variant="outline">Cancel</LinkButton>
              <Button type="submit" variant="primary" loading={loading} icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }>Update Unit</Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
