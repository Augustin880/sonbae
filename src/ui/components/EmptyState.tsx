import type { ReactNode } from 'react';
import { Button } from '@/ui/components/Button';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  children,
}: EmptyStateProps) {
  return (
    <div className="rounded-ui border border-dashed border-line bg-surface px-6 py-10 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-ui bg-brand-soft text-brand-dark">
        --
      </div>
      <h2 className="mt-4 text-xl font-bold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl leading-7 text-ink-muted">{description}</p>
      {children ? <div className="mt-5">{children}</div> : null}
      {actionLabel && onAction ? (
        <Button className="mt-6" onClick={onAction} variant="secondary">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
