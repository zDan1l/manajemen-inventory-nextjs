import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'gray' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Badge({ children, variant = 'gray', size = 'md', className = '' }: BadgeProps) {
  const variants = {
    success: 'bg-gradient-to-r from-teal-100 to-emerald-100 text-[#00A69F] border-[#00A69F]/30',
    warning: 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-amber-300',
    danger: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-300',
    info: 'bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 border-cyan-300',
    primary: 'bg-gradient-to-r from-[#00A69F]/20 to-[#0D9488]/20 text-[#00A69F] border-[#00A69F]',
    gray: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-300',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1
        font-medium rounded-full border
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}