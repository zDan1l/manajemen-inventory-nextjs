'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormInput } from '../../components/FormInput';
import { Button } from '../../components/Button';
import { LinkButton } from '@/app/components/LinkButton';
import { SelectInput } from '@/app/components/SelectInput';
import { Alert } from '@/app/components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '@/app/components/Card';

export default function AddVendor() {
  const [nama_vendor, setNamaVendor] = useState<string>('');
  const [badan_hukum, setBadanHukum] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const statusOptions = [
    { value: '1', label: 'Dalam Kontrak' },
    { value: '0', label: 'Selesai Kontrak' },
  ];

  const badanOptions = [
    { value: 'Y', label: 'Berbadan Hukum' },
    { value: 'N', label: 'Tidak Berbadan Hukum' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama_vendor || status === '') {
      setError('Vendor name and status are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nama_vendor, 
          badan_hukum, 
          status 
        }),
      });
      
      if (res.ok) {
        router.push('/vendor');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to add vendor');
      }
    } catch (err) {
      setError('Failed to add vendor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Add Vendor</h1>
        <p className="text-sm text-gray-600 mt-1">Create a new vendor profile</p>
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
            <CardTitle>Vendor Information</CardTitle>
            <CardDescription>Enter the details for the new vendor</CardDescription>
          </CardHeader>
          
          <CardBody>
            <div className="space-y-6">
              <FormInput 
                label="Vendor Name" 
                type="text" 
                value={nama_vendor} 
                onChange={(e) => setNamaVendor(e.target.value)} 
                required 
                placeholder="Enter vendor name"
                helper="The official name of the vendor company"
              />

              <SelectInput
                label="Legal Entity"
                value={badan_hukum}
                onChange={(e) => setBadanHukum(e.target.value)}
                options={badanOptions}
                placeholder="Select legal entity status"
                required
                helper="Whether the vendor is a legal entity"
              />

              <SelectInput
                label="Contract Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={statusOptions}
                placeholder="Select contract status"
                required
                helper="Current contract status with the vendor"
              />
            </div>
          </CardBody>
          
          <CardFooter>
            <div className="flex gap-3">
              <LinkButton href="/vendor" variant="outline">
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
                Save Vendor
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
