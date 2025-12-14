"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { FormInput } from "@/app/components/FormInput";
import { SelectInput } from "@/app/components/SelectInput";
import { Button } from "@/app/components/Button";
import { LinkButton } from "@/app/components/LinkButton";
import { Alert } from "@/app/components/Alert";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
} from "@/app/components/Card";

export default function EditSatuan({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [nama_satuan, setNamaSatuan] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const router = useRouter();

  const statusOptions = [
    { value: "1", label: "Aktif" },
    { value: "0", label: "Tidak Aktif" },
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
          setError(data.error || "Gagal memuat satuan");
        }
      } catch (err) {
        setError("Gagal memuat satuan");
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
      const res = await fetch("/api/satuans", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idsatuan: Number(id),
          nama_satuan,
          status: Number(status),
        }),
      });

      if (res.ok) {
        router.push("/satuan");
      } else {
        const data = await res.json();
        setError(data.error || "Gagal memperbarui satuan");
      }
    } catch (err) {
      setError("Gagal memperbarui satuan");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="bg-gradient-to-r from-[#00A69F] to-[#0D9488] rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Edit Satuan</h1>
        <p className="text-white/90">Perbarui informasi satuan</p>
      </div>

      {error && (
        <Alert
          variant="danger"
          title="Kesalahan"
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informasi Satuan</CardTitle>
            <CardDescription>
              Masukkan detail untuk memperbarui satuan
            </CardDescription>
          </CardHeader>

          <CardBody>
            <div className="space-y-6">
              <FormInput
                label="Nama Satuan"
                type="text"
                value={nama_satuan}
                onChange={(e) => setNamaSatuan(e.target.value)}
                required
                placeholder="Contoh: Kilogram, Liter, Buah"
                helper="Masukkan nama satuan pengukuran"
              />

              <SelectInput
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={statusOptions}
                placeholder="Pilih status"
                required
                helper="Status penggunaan satuan"
              />
            </div>
          </CardBody>

          <CardFooter>
            <div className="flex gap-3">
              <LinkButton href="/satuan" variant="outline" size="lg">
                Batal
              </LinkButton>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                icon={
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                }
              >
                Perbarui Satuan
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}