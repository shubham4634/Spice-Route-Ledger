
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, id, error, icon, className, ...props }) => {
  const baseClasses = "w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200";
  const errorClasses = error ? "border-red-500 focus:ring-red-500" : "";
  const disabledClasses = props.disabled ? "opacity-60 cursor-not-allowed bg-slate-600" : "";
  const iconPadding = icon ? "pl-10" : "";

  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">{icon}</div>}
        <input
          id={id}
          className={`${baseClasses} ${errorClasses} ${disabledClasses} ${iconPadding} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
};
    