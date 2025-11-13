// ==========================================
// MODERN BUTTON COMPONENT
// Design System v2.0
// ==========================================

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
  
  // Variant styles - Minimalist with solid colors and subtle shadows
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md active:shadow-sm',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white shadow-sm hover:shadow-md active:shadow-sm',
    success: 'bg-success-600 hover:bg-success-700 text-white shadow-sm hover:shadow-md active:shadow-sm',
    warning: 'bg-warning-600 hover:bg-warning-700 text-white shadow-sm hover:shadow-md active:shadow-sm',
    danger: 'bg-danger-600 hover:bg-danger-700 text-white shadow-sm hover:shadow-md active:shadow-sm',
    outline: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200',
  };

  // Size variants
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