import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Breadcrumbs } from '@/ui/components/Breadcrumbs';
import { getNavigationGroup, getNavigationItem } from '@/ui/navigation';

type PageShellProps = {
  title: string;
  description: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function PageShell({ title, description, eyebrow, actions, children }: PageShellProps) {
  const { pathname } = useLocation();
  const currentItem = getNavigationItem(pathname);
  const currentGroup = getNavigationGroup(pathname);
  const showBreadcrumbs = pathname !== '/';

  const breadcrumbs = [
    { label: 'Tableau de bord', path: '/' },
    ...(currentGroup ? [{ label: currentGroup.label }] : []),
    { label: currentItem?.label ?? title },
  ];

  return (
    <div className="space-y-8">
      {showBreadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}

      <header className="flex flex-col gap-5 border-b border-line pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="text-eyebrow uppercase tracking-[0.14em] text-brand">{eyebrow}</p>
          ) : null}
          <h1 className="mt-2 text-3xl font-bold leading-tight text-ink md:text-display">
            {title}
          </h1>
          <p className="mt-4 text-base leading-8 text-ink-muted md:text-lg">{description}</p>
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
      </header>

      {children}
    </div>
  );
}
