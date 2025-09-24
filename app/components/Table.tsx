import Link from 'next/link';


interface TableProps<T>{
    data: T[];
    columns: {key: keyof T | string; label:string}[];
    onDelete : (id: number) => void;
    editPath : string;
}

export function Table<T>({
    data,
    columns,
    onDelete,
    editPath
}: TableProps<T>){
    return (
        <table className="w-full border-collapse border">
            <thead>
                <tr>
                {columns.map((col) => (
                    <th key={col.key as string} className="border p-2">{col.label}</th>
                ))}
                <th className="border p-2">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item: any) => (
                <tr key={item.iduser || item.idrole}>
                    {columns.map((col) => (
                    <td key={col.key as string} className="border p-2">{item[col.key]}</td>
                    ))}
                    <td className="border p-2">
                    <Link href={`${editPath}/${item.iduser || item.idrole}`} className="mr-2 text-blue-600">Edit</Link>
                    <Button onClick={() => onDelete(item.iduser || item.idrole)} variant="danger">Hapus</Button>
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
    )
}