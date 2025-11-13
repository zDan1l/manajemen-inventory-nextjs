import React from 'react';

interface FormInputProps {
  label: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  step?: string;
  min?: string;
  max?: string;
  placeholder?: string;
  error?: string;
  helper?: string;
  disabled?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  step,
  min,
  max,
  placeholder,
  error,
  helper,
  disabled = false,
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-danger-600 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          step={step}
          min={min}
          max={max}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-4 py-2.5 
            border rounded-lg 
            text-sm text-gray-900
            placeholder:text-gray-400
            transition-colors duration-200
            ${error 
              ? 'border-danger-300 focus:border-danger-500 focus:ring-2 focus:ring-danger-200' 
              : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
            }
            ${disabled 
              ? 'bg-gray-50 cursor-not-allowed opacity-60' 
              : 'bg-white hover:border-gray-400'
            }
            focus:outline-none
          `}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-danger-600">{error}</p>}
      {!error && helper && <p className="mt-1.5 text-xs text-gray-500">{helper}</p>}
    </div>
  );
};
