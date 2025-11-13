// ==========================================
// MODERN LINK BUTTON COMPONENT
// Design System v2.0
// ==========================================

import Link from 'next/link';
import { ReactNode } from 'react';

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export function LinkButton({
  href,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
}: LinkButtonProps) {
  
  // Variant styles - Minimalist solid colors (match Button component)
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white shadow-sm hover:shadow-md',
    success: 'bg-success-600 hover:bg-success-700 text-white shadow-sm hover:shadow-md',
    warning: 'bg-warning-600 hover:bg-warning-700 text-white shadow-sm hover:shadow-md',
    danger: 'bg-danger-600 hover:bg-danger-700 text-white shadow-sm hover:shadow-md',
    outline: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  };

  // Size variants - match Button component
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
    <Link
      href={href}
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
        active:scale-[0.98]
        ${className}
      `}
    >
      {icon && iconPosition === 'left' && icon}
      <span>{children}</span>
      {icon && iconPosition === 'right' && icon}
    </Link>
  );
}