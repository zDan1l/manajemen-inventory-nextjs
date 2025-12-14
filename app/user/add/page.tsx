"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@/app/lib/type";
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

export default function AddUser() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [idrole, setIdrole] = useState<string>("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("/api/roles");
        const data = await res.json();
        if (res.ok) {
          setRoles(data);
        } else {
          setError(data.error || "Gagal memuat data peran");
        }
      } catch (err) {
        setError("Gagal memuat data peran");
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        username,
        password,
        idrole: idrole && idrole !== "" ? parseInt(idrole) : null,
      };

      console.log("Sending payload:", payload);

      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (res.ok) {
        router.push("/user");
      } else {
        setError(data.error || data.message || "Gagal menambahkan pengguna");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Gagal menambahkan pengguna");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = roles.map((role) => ({
    value: role.idrole,
    label: role.nama_role,
  }));

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#00A69F] to-[#0D9488] rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Tambah Pengguna</h1>
            <p className="text-teal-100">Buat akun pengguna baru</p>
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
            <CardTitle>Informasi Pengguna</CardTitle>
            <CardDescription>
              Masukkan detail untuk pengguna baru
            </CardDescription>
          </CardHeader>

          <CardBody>
            <div className="space-y-6">
              <FormInput
                label="Nama Pengguna"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Masukkan nama pengguna"
                helper="Pilih nama pengguna yang unik"
              />

              <FormInput
                label="Kata Sandi"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Masukkan kata sandi"
                helper="Minimal 6 karakter untuk keamanan"
              />

              <SelectInput
                label="Peran"
                value={idrole}
                onChange={(e) => setIdrole(e.target.value)}
                options={roleOptions}
                placeholder="Pilih peran pengguna"
                helper="Tentukan tingkat akses pengguna"
              />
            </div>
          </CardBody>

          <CardFooter>
            <div className="flex gap-3">
              <LinkButton href="/user" variant="outline" size="lg">
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
                Simpan Pengguna
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
