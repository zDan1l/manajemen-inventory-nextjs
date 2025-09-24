interface FormIputProps {
    label: string;
    type: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    step?: string;
}

export function FormInput({
    label,
    type,
    value,
    onChange,
    required,
    step,
}: FormIputProps){
    return (
        <div className="mb-4">
            <label className="block mb-1">{label}:</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-[300px] p-2 border rounded"
                required={required}
                step={step}
            />
        </div>
    )
}