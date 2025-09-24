This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Struktur Folder untuk Proyek Panjang

```bash
inventory-web-ts/
├── app/
│   ├── api/
│   │   ├── items/
│   │   │   ├── route.ts
│   │   │   └── [[...id]]/
│   │   │       └── route.ts
│   │   ├── categories/
│   │   │   ├── route.ts
│   │   │   └── [[...id]]/
│   │   │       └── route.ts
│   ├── items/
│   │   ├── page.tsx
│   │   ├── add/
│   │   │   └── page.tsx
│   │   ├── edit/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   ├── categories/
│   │   ├── page.tsx
│   │   ├── add/
│   │   │   └── page.tsx
│   │   ├── edit/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   ├── layout.tsx
│   ├── globals.css
├── components/
│   ├── Table.tsx
│   ├── FormInput.tsx
│   ├── SelectInput.tsx
│   ├── Button.tsx
├── lib/
│   ├── models/
│   │   ├── items.ts
│   │   ├── categories.ts
│   ├── services/
│   │   ├── db.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   ├── sanitization.ts
│   ├── types.ts
├── tests/
│   ├── items.test.ts
│   ├── categories.test.ts
├── tailwind.config.js
├── package.json
├── tsconfig.json
├── .env.local

```

### Penjelasan Struktur Folder

- **app/**: Berisi routing dan halaman sesuai App Router.
    - `api/<tabel>/`: API routes untuk setiap tabel.
    - `<tabel>/`: Halaman frontend untuk setiap tabel (items, categories).
- **components/**: Komponen UI reusable (tabel, input, tombol).
- **lib/**:
    - `models/`: Logika CRUD per tabel.
    - `services/`: Koneksi database dan layanan lain (misalnya, autentikasi di masa depan).
    - `utils/`: Fungsi utilitas seperti validasi dan sanitasi.
    - `types.ts`: Definisi tipe TypeScript.
- **tests/**: File untuk unit tests (opsional, contoh menggunakan Jest).
- **tailwind.config.js**: Konfigurasi Tailwind CSS untuk styling.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
