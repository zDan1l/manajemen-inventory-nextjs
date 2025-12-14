"use client";
import { useEffect, useState } from "react";
import { User } from "@/app/lib/type";
import { Table } from "@/app/components/Table";
import { LinkButton } from "../components/LinkButton";
import { Alert } from "../components/Alert";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
} from "../components/Card";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      const data: User[] | { error: string } = await res.json();
      if (res.ok && Array.isArray(data)) {
        setUsers(data);
        setError(null);
      } else {
        setError(
          (data as { error: string }).error || "Gagal memuat data pengguna"
        );
      }
    } catch (err) {
      setError("Gagal memuat data pengguna");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      try {
        const res = await fetch("/api/users", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ iduser: id }),
        });
        if (res.ok) {
          fetchUsers();
        } else {
          const data = await res.json();
          setError(data.error || "Gagal menghapus pengguna");
        }
      } catch (err) {
        setError("Gagal menghapus pengguna");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { key: "iduser", label: "ID" },
    { key: "username", label: "Nama Pengguna" },
    { key: "role_name", label: "Peran" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#00A69F] to-[#0D9488] rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Manajemen Pengguna</h1>
              <p className="text-teal-100 mt-1">
                Kelola pengguna sistem dan peran mereka
              </p>
            </div>
          </div>
          <LinkButton
            href="/user/add"
            variant="secondary"
            size="lg"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            }
          >
            Tambah Pengguna
          </LinkButton>
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

      <Card padding="none">
        <CardHeader className="p-6">
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            A list of all users in the system including their name and role.
          </CardDescription>
        </CardHeader>
        <CardBody>
          <Table
            data={users}
            columns={columns}
            onDelete={handleDelete}
            editPath="/user/edit"
            idKey="iduser"
            loading={loading}
          />
        </CardBody>
      </Card>
    </div>
  );
}
