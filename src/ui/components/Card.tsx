import type { HTMLAttributes, ReactNode } from 'react';

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: 'article' | 'aside' | 'section' | 'div';
};

export function Card({ as: Component = 'div', className = '', children, ...props }: CardProps) {
  return (
    <Component
      className={['rounded-ui border border-line bg-surface p-6 shadow-sm', className].join(' ')}
      {...props}
    >
      {children}
    </Component>
  );
}

type CardHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function CardHeader({ eyebrow, title, description, action }: CardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-eyebrow uppercase tracking-[0.14em] text-brand">{eyebrow}</p>
        ) : null}
        <h2 className="mt-1 text-xl font-bold text-ink">{title}</h2>
        {description ? <p className="mt-2 leading-7 text-ink-muted">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
