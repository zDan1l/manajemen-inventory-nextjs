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
            bg: 'bg-white',
            border: 'border-black focus:bg-red-50',
            label: 'text-black',
            accent: 'bg-red-200'
        },
        blue: {
            bg: 'bg-white',
            border: 'border-black focus:bg-blue-50',
            label: 'text-black',
            accent: 'bg-blue-200'
        },
        yellow: {
            bg: 'bg-white',
            border: 'border-black focus:bg-yellow-50',
            label: 'text-black',
            accent: 'bg-yellow-200'
        },
        green: {
            bg: 'bg-white',
            border: 'border-black focus:bg-green-50',
            label: 'text-black',
            accent: 'bg-green-200'
        },
        purple: {
            bg: 'bg-white',
            border: 'border-black focus:bg-purple-50',
            label: 'text-black',
            accent: 'bg-purple-200'
        },
        pink: {
            bg: 'bg-white',
            border: 'border-black focus:bg-pink-50',
            label: 'text-black',
            accent: 'bg-pink-200'
        }
    };

    const currentVariant = variants[variant];

    return (
        <div className="mb-4">
            <label className={`block mb-2 text-sm font-bold uppercase ${currentVariant.label}`}>
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
                        w-full p-3 border-2 ${currentVariant.border} ${currentVariant.bg}
                        font-medium text-sm placeholder-gray-400 text-black
                        focus:outline-none
                        transition-colors duration-200
                    `}
                    required={required}
                    step={step}
                />
            </div>
        </div>
    );
}