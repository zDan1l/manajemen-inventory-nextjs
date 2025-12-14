"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormInput } from "../../components/FormInput";
import { Button } from "../../components/Button";
import { LinkButton } from "@/app/components/LinkButton";
import { SelectInput } from "@/app/components/SelectInput";
import { Alert } from "@/app/components/Alert";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
} from "@/app/components/Card";

export default function AddSatuan() {
  const [nama_satuan, setNamaSatuan] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const statusOptions = [
    { value: "1", label: "Aktif" },
    { value: "0", label: "Tidak Aktif" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama_satuan || status === "") {
      setError("Nama satuan dan status wajib diisi");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/satuans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama_satuan, status: Number(status) }),
      });

      if (res.ok) {
        router.push("/satuan");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to add unit");
      }
    } catch (err) {
      setError("Failed to add unit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      <div className="bg-gradient-to-r from-[#00A69F] to-[#0D9488] rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 6h18M3 12h18M3 18h18"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Tambah Satuan</h1>
            <p className="text-orange-100 mt-1">Buat satuan pengukuran baru</p>
          </div>
        </div>
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
            <CardDescription>Masukkan detail untuk satuan baru</CardDescription>
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
              <LinkButton href="/satuan" variant="outline">
                Batal
              </LinkButton>
              <Button
                type="submit"
                variant="primary"
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
                Simpan
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}