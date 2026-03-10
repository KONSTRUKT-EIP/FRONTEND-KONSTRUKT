import React from 'react'

export function Field({ 
  label, 
  name, 
  value, 
  onChange, 
  type = "text", 
  required = false, 
  placeholder,
  min,
  max
}: { 
  label: string; 
  name: string; 
  value: string;
  onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void; 
  type?: string; 
  required?: boolean;
  placeholder?: string;
  min?: string | number;
  max?: string | number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        min={min ?? (type === "number" ? 0 : undefined)}
        max={max}
        className="border border-gray-200 rounded-lg px-3 py-2 text-base text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
      />
    </div>
  );
}