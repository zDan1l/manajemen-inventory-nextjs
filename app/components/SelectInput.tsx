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
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`
                        w-full p-4 border-4 ${currentVariant.border} ${currentVariant.bg}
                        font-bold text-lg text-black
                        focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                        focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
                        transition-all duration-200
                        focus:-translate-x-1 focus:-translate-y-1
                        appearance-none cursor-pointer
                        pr-12
                    `}
                    required={required}
                >
                    <option value="" className="bg-white text-gray-600 font-bold">
                        {placeholder || 'PILIH OPSI'}
                    </option>
                    {options.map((option: any) => (
                        <option 
                            key={option[optionKey]} 
                            value={option[optionKey]}
                            className="bg-white text-black font-bold py-2"
                        >
                            {option[optionLabel]}
                        </option>
                    ))}
                </select>
                
                {/* Custom dropdown arrow */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-black"></div>
                </div>
                
                {/* Accent bar */}
                <div className={`absolute bottom-0 left-0 w-full h-2 ${currentVariant.accent} border-2 border-black border-t-0`}></div>
            </div>
        </div>
    );
}