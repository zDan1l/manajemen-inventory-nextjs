import Link from 'next/link';
import { Button } from '@/app/components/Button';

interface TableProps<T> {
  data: T[];
  columns: { key: keyof T | string; label: string }[];
  onDelete: (id: number) => void;
  editPath: string;
  title?: string;
  variant?: 'red' | 'blue' | 'yellow' | 'green' | 'purple' | 'pink';
  idKey: keyof T;
}

export function Table<T>({
  data,
  columns,
  onDelete,
  editPath,
  title,
  variant = 'blue',
  idKey,
}: TableProps<T>) {
  const variants = {
    red: {
      headerBg: 'bg-red-500',
      rowBg: 'bg-white',
      border: 'border-black',
      accent: 'bg-red-400',
    },
    blue: {
      headerBg: 'bg-blue-200',
      rowBg: 'bg-white',
      border: 'border-black',
      accent: 'bg-blue-100',
    },
    yellow: {
      headerBg: 'bg-yellow-200',
      rowBg: 'bg-white',
      border: 'border-black',
      accent: 'bg-yellow-100',
    },
    green: {
      headerBg: 'bg-green-200',
      rowBg: 'bg-white',
      border: 'border-black',
      accent: 'bg-green-100',
    },
    purple: {
      headerBg: 'bg-purple-200',
      rowBg: 'bg-white',
      border: 'border-black',
      accent: 'bg-purple-100',
    },
    pink: {
      headerBg: 'bg-pink-200',
      rowBg: 'bg-white',
      border: 'border-black',
      accent: 'bg-pink-100',
    },
  };

  const currentVariant = variants[variant];

  return (
    <div className="w-full">
      {title && (
        <div className={`${currentVariant.accent} border-2 ${currentVariant.border} p-4 mb-4`}>
          <h2 className="text-xl font-bold uppercase text-black">
            {title}
          </h2>
        </div>
      )}

      <div className={`border-2 ${currentVariant.border} bg-white overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${currentVariant.headerBg}`}>
                {columns.map((col, index) => (
                  <th
                    key={col.key as string}
                    className={`${index !== columns.length - 1 || columns.length === 0 ? `border-r-2 ${currentVariant.border}` : ''} p-3 text-left font-bold uppercase text-black`}
                  >
                    {col.label}
                  </th>
                ))}
                <th className="p-3 text-left font-bold uppercase text-black">
                  AKSI
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="p-8 text-center text-black font-medium text-base">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-gray-100 border-2 border-black flex items-center justify-center">
                        <span className="text-lg">📦</span>
                      </div>
                      Tidak ada data tersedia
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item: any, index) => (
                  <tr
                    key={item.iduser || item.idrole || index}
                    className={`${currentVariant.rowBg} border-b border-gray-600`}
                  >
                    {columns.map((col, colIndex) => (
                      <td
                        key={col.key as string}
                        className={`${colIndex !== columns.length - 1 ? `border-r border-gray-600` : ''} p-3 font-medium text-black`}
                      >
                        {item[col.key] || '-'}
                      </td>
                    ))}
                    <td className="p-3">
                      <div className="flex gap-2 items-center">
                        <Link
                          href={`${editPath}/${item[idKey]}`}
                          className="px-3 py-1 bg-yellow-200 border-2 border-black font-bold text-black uppercase text-xs"
                        >
                          EDIT
                        </Link>
                        <Button
                          onClick={() => onDelete(item[idKey])}
                          variant="danger"
                          size="small"
                          className="px-3 py-1 border-2 border-black font-bold text-white uppercase text-xs"
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