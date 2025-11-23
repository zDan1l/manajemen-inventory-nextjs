// ==========================================
// MODERN TABLE COMPONENT
// Design System v3.0 - Minimalist with #00A69F
// ==========================================

import Link from "next/link";
import { MdVisibility, MdEdit, MdDelete } from "react-icons/md";

interface TableProps<T> {
  data: T[];
  columns: { key: keyof T | string; label: string }[];
  onDelete?: (id: number) => void;
  editPath?: string;
  detailPath?: string;
  title?: string;
  idKey: keyof T;
  isTransaction?: boolean;
  loading?: boolean;
  hideActions?: boolean;
}

export function Table<T>({
  data,
  columns,
  onDelete,
  editPath,
  detailPath,
  title,
  idKey,
  isTransaction = false,
  loading = false,
  hideActions = false,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-12 flex flex-col justify-center items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#00A69F]"></div>
          <span className="text-base font-medium text-gray-600">
            Loading data...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {title && (
        <div className="px-8 py-5 border-b border-gray-200 bg-gradient-to-r from-[#00A69F]/5 to-white">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-slate-50">
              {columns.map((col) => (
                <th
                  key={col.key as string}
                  scope="col"
                  className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wide border-b-2 border-gray-200"
                >
                  {col.label}
                </th>
              ))}
              {!hideActions && (
                <th
                  scope="col"
                  className="px-6 py-4 text-center text-sm font-bold text-gray-700 uppercase tracking-wide border-b-2 border-gray-200"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                      <MdVisibility className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">
                        No data available
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        There are no records to display at the moment
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item: any, index) => (
                <tr
                  key={item[idKey] || index}
                  className={`transition-all duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                  } hover:bg-[#00A69F]/5 hover:shadow-sm border-l-4 border-transparent hover:border-l-[#00A69F]`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key as string}
                      className="px-6 py-4 text-[15px] font-medium text-gray-700 whitespace-nowrap"
                    >
                      {item[col.key] !== null && item[col.key] !== undefined
                        ? item[col.key]
                        : "-"}
                    </td>
                  ))}
                  {!hideActions && (
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {isTransaction ? (
                          detailPath && (
                            <Link
                              href={`${detailPath}/${item[idKey]}`}
                              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                            >
                              <MdVisibility className="w-4 h-4" />
                              Detail
                            </Link>
                          )
                        ) : (
                          <>
                            {editPath && (
                              <Link
                                href={`${editPath}/${item[idKey]}`}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#00A69F] to-[#0D9488] hover:from-[#0D9488] hover:to-[#00857A] rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                              >
                                <MdEdit className="w-4 h-4" />
                                Edit
                              </Link>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(item[idKey])}
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                              >
                                <MdDelete className="w-4 h-4" />
                                Delete
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
