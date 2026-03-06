import React from 'react'

export function Field({ label, name, value, onChange, type = "text", required = false}: { label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; required?: boolean;}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xl font-medium text-gray-600">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        min={type === "number" ? 0 : undefined}
        className="border border-gray-200 rounded-lg px-4 py-4 text-base-xl text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
      />
    </div>
  );
}