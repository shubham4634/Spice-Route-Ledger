import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
  placeholder?: string; // Added placeholder to props
}

export const Select: React.FC<SelectProps> = ({ label, id, error, options, className, placeholder, ...restProps }) => {
  const baseClasses = "w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 appearance-none transition-colors duration-200";
  const errorClasses = error ? "border-red-500 focus:ring-red-500" : "";
  const disabledClasses = restProps.disabled ? "opacity-60 cursor-not-allowed bg-slate-600" : "";

  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>}
      <div className="relative">
        <select
          id={id}
          className={`${baseClasses} ${errorClasses} ${disabledClasses} ${className}`}
          {...restProps} // Spread restProps, which no longer includes placeholder
        >
          {placeholder && <option value="" disabled selected={restProps.value === '' || restProps.value === undefined}>{placeholder}</option>}
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
};