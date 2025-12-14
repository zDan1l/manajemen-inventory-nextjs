"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { FormInput } from "@/app/components/FormInput";
import { Button } from "@/app/components/Button";
import { LinkButton } from "@/app/components/LinkButton";

export default function EditRole({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [nama_role, setNamaRole] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch(`/api/roles/${id}`);
        const data = await res.json();
        if (res.ok) {
          setNamaRole(data.nama_role);
        } else {
          setError(data.error || "Failed to fetch user");
        }
      } catch (err) {
        setError("Failed to fetch user");
      }
    };

    fetchRole();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/roles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idrole: Number(id), nama_role }),
      });
      if (res.ok) {
        router.push("/role");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update role");
      }
    } catch (err) {
      setError("Failed to update role");
    }
  };

  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="mt-30 p-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Edit Peran</h1>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Nama Peran"
          type="text"
          value={nama_role}
          onChange={setNamaRole}
          required
        />
        <div className="flex">
          <div className="flex gap-2">
            <LinkButton href="/role" variant="primary" size="medium">
              Kembali
            </LinkButton>
          </div>
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </div>
  );
}
