'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormInput } from '../../components/FormInput';
import { Button } from '../../components/Button';
import { LinkButton } from '@/app/components/LinkButton';
import { SelectInput } from '@/app/components/SelectInput';
import { Alert } from '@/app/components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '@/app/components/Card';

export default function AddSatuan() {
  const [nama_satuan, setNamaSatuan] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const statusOptions = [
    { value: 0, label: 'Tidak Bisa Dipakai' },
    { value: 1, label: 'Bisa Dipakai' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama_satuan || status === '') {
      setError('Nama satuan dan status wajib diisi');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/satuans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_satuan, status: Number(status) }),
      });
      
      if (res.ok) {
        router.push('/satuan');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to add unit');
      }
    } catch (err) {
      setError('Failed to add unit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Add Unit</h1>
        <p className="text-sm text-gray-600 mt-1">Create a new measurement unit</p>
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
            <CardTitle>Unit Information</CardTitle>
            <CardDescription>Enter the details for the new unit</CardDescription>
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
              <LinkButton href="/satuan" variant="outline">
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
                Save Unit
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
