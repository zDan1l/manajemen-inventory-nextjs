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
      bg: 'bg-blue-400',
      border: 'border-black',
      text: 'text-black',
      hoverBg: 'hover:bg-blue-300',
      shadow: 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
    },
    secondary: {
      bg: 'bg-gray-300',
      border: 'border-black',
      text: 'text-black',
      hoverBg: 'hover:bg-gray-200',
      shadow: 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
    },
    danger: {
      bg: 'bg-red-400',
      border: 'border-black',
      text: 'text-black',
      hoverBg: 'hover:bg-red-300',
      shadow: 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
    },
    success: {
      bg: 'bg-green-400',
      border: 'border-black',
      text: 'text-black',
      hoverBg: 'hover:bg-green-300',
      shadow: 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
    },
    warning: {
      bg: 'bg-yellow-400',
      border: 'border-black',
      text: 'text-black',
      hoverBg: 'hover:bg-yellow-300',
      shadow: 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
    },
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
        inline ${currentVariant.bg} ${currentVariant.border} ${currentVariant.text} ${currentVariant.hoverBg}
        border-4 font-black uppercase tracking-wider
        ${currentSize}
        transition-all duration-200
        ${currentVariant.shadow}
        hover:-translate-x-1 hover:-translate-y-1
        active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
        ${className} 
      `}
    >
      {children}
    </Link>
  );
}