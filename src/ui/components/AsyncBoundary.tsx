import type { ReactNode } from 'react';
import { LoadingSkeleton } from '@/ui/components/LoadingSkeleton';

type AsyncBoundaryProps<T> = {
  state:
    | { status: 'loading'; data: null; error: null }
    | { status: 'success'; data: T; error: null }
    | { status: 'error'; data: null; error: Error };
  children: (data: T) => ReactNode;
};

export function AsyncBoundary<T>({ state, children }: AsyncBoundaryProps<T>) {
  if (state.status === 'loading') {
    return <LoadingSkeleton lines={5} />;
  }

  if (state.status === 'error') {
    return (
      <div className="rounded-ui border border-danger/30 bg-danger-soft p-4 text-danger">
        Une erreur est survenue.
      </div>
    );
  }

  return <>{children(state.data)}</>;
}
