import Link from 'next/link';

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function LinkButton({
  href,
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
}: LinkButtonProps) {
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
      bg: 'bg-red-200',
      border: 'border-black',
      text: 'text-black',
      hoverBg: 'hover:bg-red-300'
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
    large: 'px-8 py-4 text-lg',
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];

  return (
    <Link
      href={href}
      className={`
        inline-block ${currentVariant.bg} ${currentVariant.border} ${currentVariant.text} ${currentVariant.hoverBg}
        border-2 font-bold uppercase
        ${currentSize}
        transition-colors duration-200
        ${className} 
      `}
    >
      {children}
    </Link>
  );
}