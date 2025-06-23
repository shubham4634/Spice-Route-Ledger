
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, id, error, className, ...props }) => {
  const baseClasses = "w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors duration-200";
  const errorClasses = error ? "border-red-500 focus:ring-red-500" : "";
  const disabledClasses = props.disabled ? "opacity-60 cursor-not-allowed bg-slate-600" : "";

  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>}
      <textarea
        id={id}
        rows={4}
        className={`${baseClasses} ${errorClasses} ${disabledClasses} ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
};
    