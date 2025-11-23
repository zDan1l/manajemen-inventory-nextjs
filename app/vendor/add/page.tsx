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

export default function AddVendor() {
  const [nama_vendor, setNamaVendor] = useState<string>("");
  const [badan_hukum, setBadanHukum] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const statusOptions = [
    { value: "1", label: "Aktif" },
    { value: "0", label: "Tidak Aktif" },
  ];

  const badanOptions = [
    { value: "P", label: "PT (Perseroan Terbatas)" },
    { value: "C", label: "CV (Commanditaire Vennootschap)" },
    { value: "F", label: "Firma" },
    { value: "K", label: "Koperasi" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama_vendor || status === "") {
      setError("Nama vendor dan status wajib diisi");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_vendor,
          badan_hukum,
          status,
        }),
      });

      if (res.ok) {
        router.push("/vendor");
      } else {
        const data = await res.json();
        setError(data.error || "Gagal menambahkan vendor");
      }
    } catch (err) {
      setError("Gagal menambahkan vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Tambah Vendor</h1>
            <p className="text-green-100 mt-1">Buat profil vendor baru</p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          variant="danger"
          title="Kesalahan"
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Form Card */}
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informasi Vendor</CardTitle>
            <CardDescription>Masukkan detail untuk vendor baru</CardDescription>
          </CardHeader>

          <CardBody>
            <div className="space-y-6">
              <FormInput
                label="Nama Vendor"
                type="text"
                value={nama_vendor}
                onChange={(e) => setNamaVendor(e.target.value)}
                required
                placeholder="Masukkan nama vendor"
                helper="Nama resmi perusahaan vendor"
              />

              <SelectInput
                label="Badan Hukum"
                value={badan_hukum}
                onChange={(e) => setBadanHukum(e.target.value)}
                options={badanOptions}
                placeholder="Pilih badan hukum"
                required
                helper="Jenis badan hukum vendor"
              />

              <SelectInput
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={statusOptions}
                placeholder="Pilih status"
                required
                helper="Status vendor: Aktif atau Tidak Aktif"
              />
            </div>
          </CardBody>

          <CardFooter>
            <div className="flex gap-3">
              <LinkButton href="/vendor" variant="outline">
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
