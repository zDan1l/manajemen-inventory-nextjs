import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
}: ButtonProps) {

  const variants = {
    primary: 'bg-gradient-to-r from-[#00A69F] to-[#0D9488] hover:from-[#0D9488] hover:to-[#00A69F] text-white shadow-sm hover:shadow-md active:shadow-sm',
    secondary: 'bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white shadow-sm hover:shadow-md active:shadow-sm',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-sm hover:shadow-md active:shadow-sm',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm hover:shadow-md active:shadow-sm',
    danger: 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-sm hover:shadow-md active:shadow-sm',
    outline: 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-[#00A69F] shadow-sm hover:shadow-md',
    ghost: 'bg-transparent text-gray-700 hover:bg-[#00A69F]/10 active:bg-[#00A69F]/20',
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
    xl: 'px-10 py-4 text-xl',
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${currentVariant}
        ${currentSize}
        ${fullWidth ? 'w-full' : ''}
        inline-flex items-center justify-center gap-2
        font-medium rounded-lg
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${variant === 'primary' ? 'focus:ring-primary-500' : ''}
        ${variant === 'success' ? 'focus:ring-success-500' : ''}
        ${variant === 'danger' ? 'focus:ring-danger-500' : ''}
        ${variant === 'warning' ? 'focus:ring-warning-500' : ''}
        ${variant === 'secondary' ? 'focus:ring-secondary-500' : ''}
        ${variant === 'outline' || variant === 'ghost' ? 'focus:ring-gray-400' : ''}
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        active:scale-[0.98]
        ${className}
      `}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {!loading && icon && iconPosition === 'left' && icon}

      <span>{children}</span>

      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
}