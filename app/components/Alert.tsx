import { ReactNode } from 'react';
import { MdCheckCircle, MdWarning, MdError, MdInfo, MdClose } from 'react-icons/md';

interface AlertProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  onClose?: () => void;
  className?: string;
}

export function Alert({ children, variant = 'info', title, onClose, className = '' }: AlertProps) {
  const variants = {
    success: {
      container: 'bg-gradient-to-r from-teal-50 to-emerald-50 border-[#00A69F] text-gray-800',
      icon: <MdCheckCircle className="w-5 h-5 text-[#00A69F]" />,
      iconBg: 'bg-[#00A69F]/10',
    },
    warning: {
      container: 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-400 text-gray-800',
      icon: <MdWarning className="w-5 h-5 text-amber-600" />,
      iconBg: 'bg-amber-100',
    },
    danger: {
      container: 'bg-gradient-to-r from-red-50 to-rose-50 border-red-400 text-gray-800',
      icon: <MdError className="w-5 h-5 text-red-600" />,
      iconBg: 'bg-red-100',
    },
    info: {
      container: 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-400 text-gray-800',
      icon: <MdInfo className="w-5 h-5 text-cyan-600" />,
      iconBg: 'bg-cyan-100',
    },
  };

  const currentVariant = variants[variant];

  return (
    <div
      className={`
        ${currentVariant.container}
        border rounded-lg p-4
        flex items-start gap-3
        ${className}
      `}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">
        {currentVariant.icon}
      </div>

      <div className="flex-1">
        {title && (
          <h4 className="text-sm font-semibold mb-1">
            {title}
          </h4>
        )}
        <div className="text-sm">
          {children}
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-2 text-current hover:opacity-75 transition-opacity"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
}