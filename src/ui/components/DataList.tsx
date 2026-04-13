import type { ReactNode } from 'react';

export type DataListItem = {
  label: string;
  value: ReactNode;
  meta?: ReactNode;
};

type DataListProps = {
  items: DataListItem[];
};

export function DataList({ items }: DataListProps) {
  return (
    <dl className="divide-y divide-line rounded-ui border border-line bg-surface">
      {items.map((item) => (
        <div className="grid gap-2 px-5 py-4 sm:grid-cols-[14rem_1fr]" key={item.label}>
          <dt className="text-sm font-bold text-ink">{item.label}</dt>
          <dd className="text-sm leading-6 text-ink-muted">
            <div>{item.value}</div>
            {item.meta ? <div className="mt-1 text-xs text-ink-subtle">{item.meta}</div> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
