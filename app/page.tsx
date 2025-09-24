import Link from "next/link";

export default function Home() {
  return (
     <div className="p-5">
        <h1 className="text-2xl font-bold mb-5">Sistem Inventori</h1>
        <div className="flex gap-4">
          <Link href="/user" className="px-4 py-2 bg-blue-600 text-white rounded">Kelola Pengguna</Link>
          <Link href="/role" className="px-4 py-2 bg-green-600 text-white rounded">Kelola Peran</Link>
        </div>
      </div>
  )
}
