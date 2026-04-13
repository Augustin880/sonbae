import type { InputHTMLAttributes } from 'react';

type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function SearchInput({ label, className = '', ...props }: SearchInputProps) {
  return (
    <label className={['relative block', className].join(' ')}>
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle"
      >
        Rechercher
      </span>
      <input
        className="min-h-11 w-full rounded-ui border border-line bg-surface py-2 pl-16 pr-4 text-sm text-ink shadow-sm transition placeholder:text-ink-subtle focus:border-brand focus:shadow-focus"
        type="search"
        {...props}
      />
    </label>
  );
}
