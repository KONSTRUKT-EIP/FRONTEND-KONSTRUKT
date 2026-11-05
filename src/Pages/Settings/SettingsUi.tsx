import React from 'react';
import { CircleAlert, CircleCheck } from 'lucide-react';

export const SettingsCard: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ title, description, children, footer }) => (
  <section className="bg-white rounded-2xl ring-1 ring-gray-200/70 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
    <div className="px-6 pt-6">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
    <div className="px-6 py-6 flex flex-col gap-5">{children}</div>
    {footer && (
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/60 rounded-b-2xl flex flex-wrap items-center justify-end gap-3">
        {footer}
      </div>
    )}
  </section>
);

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  className?: string;
  label: string;
  hint?: string;
  trailing?: React.ReactNode;
}

export const TextField: React.FC<TextFieldProps> = ({ label, hint, trailing, id, className = '', ...props }) => (
  <label htmlFor={id} className="flex flex-col gap-1.5">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <span className="relative">
      <input
        id={id}
        className={`w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-50 disabled:text-gray-500 ${trailing ? 'pr-11' : ''} ${className}`}
        {...props}
      />
      {trailing && <span className="absolute inset-y-0 right-2 flex items-center">{trailing}</span>}
    </span>
    {hint && <span className="text-xs text-gray-500">{hint}</span>}
  </label>
);

export const ReadOnlyField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <div className="rounded-xl bg-gray-50 px-3.5 py-2.5 text-gray-700 ring-1 ring-inset ring-gray-200">{children}</div>
  </div>
);

export const Feedback: React.FC<{ type: 'success' | 'error'; children: React.ReactNode }> = ({ type, children }) => (
  <p
    role={type === 'error' ? 'alert' : 'status'}
    className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${
      type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
    }`}
  >
    {type === 'error' ? (
      <CircleAlert className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
    ) : (
      <CircleCheck className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
    )}
    {children}
  </p>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  className = '',
  ...props
}) => (
  <button
    className={`rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

export const SecondaryButton: React.FC<ButtonProps> = ({
  className = '',
  ...props
}) => (
  <button
    className={`rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);
