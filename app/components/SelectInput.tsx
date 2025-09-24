interface SelectInputProps<T> {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: T[];
    optionKey: keyof T;
    optionLabel: keyof T;
    placeholder?: string;
}

export function SelectInput<T>({
    label,
    value,
    onChange,
    options,
    optionKey,
    optionLabel,
    placeholder,
}: SelectInputProps<T>){
    return (
        <div className="mb-4">
            <label className="block mb-1">{label}:</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-[300px] p-2 border rounded">
                <option value="">{placeholder || 'Pilih opsi'}</option>
                {options.map((option: any) => (
                <option key={option[optionKey]} value={option[optionKey]}>{option[optionLabel]}</option>
                ))}
            </select>
        </div>
    )
}