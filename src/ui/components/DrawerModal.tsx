import type { ReactNode } from 'react';
import { Button } from '@/ui/components/Button';

type DrawerModalProps = {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function DrawerModal({ title, open, onClose, children }: DrawerModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      aria-labelledby="drawer-title"
      aria-modal="true"
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
    >
      <button
        aria-label="Fermer la navigation"
        className="absolute inset-0 bg-ink/45"
        onClick={onClose}
        type="button"
      />
      <aside className="absolute inset-y-0 left-0 flex w-full max-w-sm flex-col bg-surface shadow-soft">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-bold text-ink" id="drawer-title">
            {title}
          </h2>
          <Button onClick={onClose} size="sm" variant="ghost">
            Fermer
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
      </aside>
    </div>
  );
}
