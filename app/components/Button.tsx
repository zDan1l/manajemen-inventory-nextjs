interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    className?: string;
}

export function Button({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'medium',
    disabled = false,
    className = '',
}: ButtonProps) {
    const variants = {
        primary: {
            bg: 'bg-blue-200',
            border: 'border-black',
            text: 'text-black',
            hoverBg: 'hover:bg-blue-300'
        },
        secondary: {
            bg: 'bg-gray-200',
            border: 'border-black',
            text: 'text-black',
            hoverBg: 'hover:bg-gray-300'
        },
        danger: {
            bg: 'bg-red-400',
            border: 'border-black',
            text: 'text-black',
            hoverBg: 'hover:bg-red-500'
        },
        success: {
            bg: 'bg-green-200',
            border: 'border-black',
            text: 'text-black',
            hoverBg: 'hover:bg-green-300'
        },
        warning: {
            bg: 'bg-yellow-200',
            border: 'border-black',
            text: 'text-black',
            hoverBg: 'hover:bg-yellow-300'
        }
    };

    const sizes = {
        small: 'px-4 py-2 text-sm',
        medium: 'px-6 py-3 text-base',
        large: 'px-8 py-4 text-lg'
    };

    const currentVariant = variants[variant];
    const currentSize = sizes[size];

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                ${currentVariant.bg} ${currentVariant.border} ${currentVariant.text} ${currentVariant.hoverBg}
                border-2 font-bold uppercase
                ${currentSize}
                transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
            `}
        >
            {children}
        </button>
    );
}