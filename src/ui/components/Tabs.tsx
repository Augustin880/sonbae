import type { ReactNode } from 'react';

export type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
};

type TabsProps = {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
};

export function Tabs({ items, activeId, onChange }: TabsProps) {
  const activeItem = items.find((item) => item.id === activeId) ?? items[0];

  return (
    <div>
      <div className="border-b border-line" role="tablist" aria-label="Page sections">
        <div className="flex gap-2 overflow-x-auto">
          {items.map((item) => (
            <button
              aria-selected={item.id === activeItem.id}
              className={[
                'min-h-11 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-bold transition',
                item.id === activeItem.id
                  ? 'border-brand text-brand-dark'
                  : 'border-transparent text-ink-muted hover:text-ink',
              ].join(' ')}
              id={`tab-${item.id}`}
              key={item.id}
              onClick={() => onChange(item.id)}
              role="tab"
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div aria-labelledby={`tab-${activeItem.id}`} className="pt-6" role="tabpanel">
        {activeItem.content}
      </div>
    </div>
  );
}
