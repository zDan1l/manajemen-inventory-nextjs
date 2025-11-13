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
            border-2 rounded-xl 
            text-sm text-gray-900
            placeholder:text-gray-400
            transition-all duration-200
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50/30' 
              : 'border-gray-200 focus:border-[#00A69F] focus:ring-4 focus:ring-[#00A69F]/10 hover:border-gray-300'
            }
            focus:outline-none
          `}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 animate-fadeIn">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {!error && helper && (
        <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-[#00A69F]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {helper}
        </p>
      )}
    </div>
  );
};
