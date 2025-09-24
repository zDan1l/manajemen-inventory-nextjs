interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
}: ButtonProps){
    return (
        <button
        type={type}
        onClick={onClick}
        className={`px-4 py-2 rounded ${variant === 'danger' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}
        >
        {children}
        </button>
    )
}