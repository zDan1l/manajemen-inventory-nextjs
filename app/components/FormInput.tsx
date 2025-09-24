interface FormInputProps {
    label: string;
    type: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    step?: string;
    placeholder?: string;
    variant?: 'red' | 'blue' | 'yellow' | 'green' | 'purple' | 'pink';
}

export function FormInput({
    label,
    type,
    value,
    onChange,
    required,
    step,
    placeholder,
    variant = 'blue',
}: FormInputProps) {
    const variants = {
        red: {
            bg: 'bg-red-100',
            border: 'border-black focus:bg-red-50',
            label: 'text-black',
            accent: 'bg-red-400'
        },
        blue: {
            bg: 'bg-blue-100',
            border: 'border-black focus:bg-blue-50',
            label: 'text-black',
            accent: 'bg-blue-400'
        },
        yellow: {
            bg: 'bg-yellow-100',
            border: 'border-black focus:bg-yellow-50',
            label: 'text-black',
            accent: 'bg-yellow-400'
        },
        green: {
            bg: 'bg-green-100',
            border: 'border-black focus:bg-green-50',
            label: 'text-black',
            accent: 'bg-green-400'
        },
        purple: {
            bg: 'bg-purple-100',
            border: 'border-black focus:bg-purple-50',
            label: 'text-black',
            accent: 'bg-purple-400'
        },
        pink: {
            bg: 'bg-pink-100',
            border: 'border-black focus:bg-pink-50',
            label: 'text-black',
            accent: 'bg-pink-400'
        }
    };

    const currentVariant = variants[variant];

    return (
        <div className="mb-6 group">
            <label className={`block mb-3 text-lg font-black uppercase tracking-wider ${currentVariant.label}`}>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`
                        w-full p-4 border-4 ${currentVariant.border} ${currentVariant.bg}
                        font-bold text-lg placeholder-gray-500 text-black
                        focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                        focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                        transition-all duration-200
                        focus:-translate-x-1 focus:-translate-y-1
                    `}
                    required={required}
                    step={step}
                />
                {/* Accent bar */}
                <div className={`absolute bottom-0 left-0 w-full h-2 ${currentVariant.accent} border-2 border-black border-t-0`}></div>
            </div>
        </div>
    );
}