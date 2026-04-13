import type { ReactNode } from 'react';

type BadgeTone = 'neutral' | 'brand' | 'accent' | 'signal' | 'success' | 'danger' | 'info';

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
};

const toneClass: Record<BadgeTone, string> = {
  neutral: 'bg-canvas text-ink-muted ring-line',
  brand: 'bg-brand-soft text-brand-dark ring-brand/20',
  accent: 'bg-accent-soft text-accent ring-accent/20',
  signal: 'bg-signal-soft text-signal ring-signal/20',
  success: 'bg-success-soft text-success ring-success/20',
  danger: 'bg-danger-soft text-danger ring-danger/20',
  info: 'bg-info-soft text-info ring-info/20',
};

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-smui px-2.5 py-1 text-xs font-bold ring-1',
        toneClass[tone],
      ].join(' ')}
    >
      {children}
    </span>
  );
}
