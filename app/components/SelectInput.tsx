interface SelectInputProps<T> {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: T[];
    optionKey: keyof T;
    optionLabel: keyof T;
    placeholder?: string;
    variant?: 'red' | 'blue' | 'yellow' | 'green' | 'purple' | 'pink';
    required?: boolean;
}

export function SelectInput<T>({
    label,
    value,
    onChange,
    options,
    optionKey,
    optionLabel,
    placeholder,
    variant = 'blue',
    required = false,
}: SelectInputProps<T>) {
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
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`
                        w-full p-3 border-2 ${currentVariant.border} ${currentVariant.bg}
                        font-medium text-sm text-black
                        focus:outline-none
                        transition-colors duration-200
                        appearance-none cursor-pointer
                        pr-10
                    `}
                    required={required}
                >
                    <option value="" className="bg-white text-gray-500 font-medium">
                        {placeholder || 'Pilih opsi'}
                    </option>
                    {options.map((option: any) => (
                        <option 
                            key={option[optionKey]} 
                            value={option[optionKey]}
                            className="bg-white text-black font-medium"
                        >
                            {option[optionLabel]}
                        </option>
                    ))}
                </select>
                
                {/* Custom dropdown arrow */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-black"></div>
                </div>
            </div>
        </div>
    );
}