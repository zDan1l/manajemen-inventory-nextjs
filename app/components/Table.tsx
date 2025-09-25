import Link from 'next/link';
import { Button } from '@/app/components/Button';

interface TableProps<T> {
  data: T[];
  columns: { key: keyof T | string; label: string }[];
  onDelete: (id: number) => void;
  editPath: string;
  title?: string;
  variant?: 'red' | 'blue' | 'yellow' | 'green' | 'purple' | 'pink';
}

export function Table<T>({
  data,
  columns,
  onDelete,
  editPath,
  title,
  variant = 'blue',
}: TableProps<T>) {
  const variants = {
    red: {
      headerBg: 'bg-red-400',
      rowBg: 'bg-red-50 hover:bg-red-100',
      border: 'border-black',
      accent: 'bg-red-200',
    },
    blue: {
      headerBg: 'bg-blue-400',
      rowBg: 'bg-blue-50 hover:bg-blue-100',
      border: 'border-black',
      accent: 'bg-blue-200',
    },
    yellow: {
      headerBg: 'bg-yellow-400',
      rowBg: 'bg-yellow-50 hover:bg-yellow-100',
      border: 'border-black',
      accent: 'bg-yellow-200',
    },
    green: {
      headerBg: 'bg-green-400',
      rowBg: 'bg-green-50 hover:bg-green-100',
      border: 'border-black',
      accent: 'bg-green-200',
    },
    purple: {
      headerBg: 'bg-purple-400',
      rowBg: 'bg-purple-50 hover:bg-purple-100',
      border: 'border-black',
      accent: 'bg-purple-200',
    },
    pink: {
      headerBg: 'bg-pink-400',
      rowBg: 'bg-pink-50 hover:bg-pink-100',
      border: 'border-black',
      accent: 'bg-pink-200',
    },
  };

  const currentVariant = variants[variant];

  return (
    <div className="w-full">
      {title && (
        <div className={`${currentVariant.accent} border-4 ${currentVariant.border} p-6 mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform -rotate-1`}>
          <h2 className="text-3xl font-black uppercase tracking-wider text-black">
            {title}
          </h2>
          <div className="mt-2 flex gap-2">
            <div className="w-4 h-4 bg-black"></div>
            <div className="w-4 h-4 bg-black"></div>
            <div className="w-4 h-4 bg-black"></div>
          </div>
        </div>
      )}

      <div className={`border-4 ${currentVariant.border} bg-white overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${currentVariant.headerBg}`}>
                {columns.map((col, index) => (
                  <th
                    key={col.key as string}
                    className={`${index !== columns.length - 1 || columns.length === 0 ? `border-r-4 ${currentVariant.border}` : ''} p-4 text-left font-black uppercase tracking-wider text-black`}
                  >
                    {col.label}
                  </th>
                ))}
                <th className="p-4 text-left font-black uppercase tracking-wider text-black">
                  AKSI
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="p-12 text-center text-black font-bold text-xl">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gray-200 border-4 border-black flex items-center justify-center">
                        <span className="text-2xl">📦</span>
                      </div>
                      TIDAK ADA DATA TERSEDIA
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item: any, index) => (
                  <tr
                    key={item.iduser || item.idrole || index}
                    className={`${currentVariant.rowBg} transition-all duration-200 border-b-2 ${currentVariant.border}`}
                  >
                    {columns.map((col, colIndex) => (
                      <td
                        key={col.key as string}
                        className={`${colIndex !== columns.length - 1 ? `border-r-2 ${currentVariant.border}` : ''} p-4 font-bold text-black`}
                      >
                        {item[col.key] || '-'}
                      </td>
                    ))}
                    <td className="p-4">
                      <div className="flex gap-3 items-center">
                        <Link
                          href={`${editPath}/${item.iduser || item.idrole || item.idsatuan}`}
                          className="px-4 py-2 bg-yellow-300 border-3 border-black font-black text-black uppercase text-sm hover:bg-yellow-200 transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
                        >
                          EDIT
                        </Link>
                        <Button
                          onClick={() => onDelete(item.iduser || item.idrole || item.idsatuan)}
                          variant="danger"
                          size="small"
                          className="px-4 py-2 border-3 border-black font-black text-white uppercase text-sm hover:bg-red-600 transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1"
                        >
                          HAPUS
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}