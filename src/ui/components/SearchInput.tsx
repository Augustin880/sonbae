import type { InputHTMLAttributes } from 'react';

type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function SearchInput({ label, className = '', ...props }: SearchInputProps) {
  return (
    <label className={['relative block', className].join(' ')}>
      <span className="sr-only">{label}</span>
      <input
        aria-label={label}
        className="min-h-11 w-full rounded-ui border border-line bg-surface px-4 py-2 text-sm text-ink shadow-sm transition placeholder:text-ink-subtle focus:border-brand focus:shadow-focus"
        type="search"
        {...props}
      />
    </label>
  );
}
