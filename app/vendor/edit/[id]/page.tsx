'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { FormInput } from '@/app/components/FormInput';
import { SelectInput } from '@/app/components/SelectInput';
import { Button } from '@/app/components/Button';
import { LinkButton } from '@/app/components/LinkButton';
import { Alert } from '@/app/components/Alert';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '@/app/components/Card';

export default function EditVendor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [namaVendor, setNamaVendor] = useState<string>('');
  const [badanHukum, setBadanHukum] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const router = useRouter();

  const badanHukumOptions = [
    { value: 'Y', label: 'Berbadan Hukum' },
    { value: 'N', label: 'Tidak Berbadan Hukum' },
  ];

  const statusOptions = [
    { value: '1', label: 'Dalam Kontrak' },
    { value: '0', label: 'Selesai Kontrak' },
  ];

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await fetch(`/api/vendors/${id}`);
        const data = await res.json();
        if (res.ok) {
          setNamaVendor(data.nama_vendor);
          setBadanHukum(data.badan_hukum);
          setStatus(data.status);
        } else {
          setError(data.error || 'Failed to fetch vendor');
        }
      } catch (err) {
        setError('Failed to fetch vendor');
      } finally {
        setLoadingData(false);
      }
    };

    fetchVendor();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/vendors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          idvendor: Number(id),
          nama_vendor: namaVendor, 
          badan_hukum: badanHukum, 
          status 
        }),
      });
      
      if (res.ok) {
        router.push('/vendor');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update vendor');
      }
    } catch (err) {
      setError('Failed to update vendor');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading vendor data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Edit Vendor</h1>
        <p className="text-sm text-gray-600 mt-1">Update vendor information</p>
      </div>

      {error && (
        <Alert variant="danger" title="Error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Vendor Information</CardTitle>
            <CardDescription>Update the vendor details below</CardDescription>
          </CardHeader>
          
          <CardBody>
            <div className="space-y-6">
              <FormInput 
                label="Vendor Name" 
                type="text" 
                value={namaVendor} 
                onChange={(e) => setNamaVendor(e.target.value)} 
                required 
                placeholder="Enter vendor name"
                helper="The official name of the vendor or supplier"
              />

              <SelectInput
                label="Legal Entity"
                value={badanHukum}
                onChange={(e) => setBadanHukum(e.target.value)}
                options={badanHukumOptions}
                placeholder="Select legal entity status"
                required
                helper="Whether the vendor is a registered legal entity"
              />

              <SelectInput
                label="Contract Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={statusOptions}
                placeholder="Select contract status"
                required
                helper="Current contractual relationship with the vendor"
              />
            </div>
          </CardBody>
          
          <CardFooter>
            <div className="flex gap-3">
              <LinkButton href="/vendor" variant="outline">Cancel</LinkButton>
              <Button type="submit" variant="primary" loading={loading} icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }>Update Vendor</Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
