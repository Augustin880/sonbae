import { useEffect, useState } from 'react';

type AsyncState<T> =
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: Error };

export function useAsync<T>(loader: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({
    status: 'loading',
    data: null,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    setState({ status: 'loading', data: null, error: null });

    loader()
      .then((data) => {
        if (mounted) {
          setState({ status: 'success', data, error: null });
        }
      })
      .catch((error: unknown) => {
        if (mounted) {
          setState({
            status: 'error',
            data: null,
            error: error instanceof Error ? error : new Error('Unknown error'),
          });
        }
      });

    return () => {
      mounted = false;
    };
  }, [loader]);

  return state;
}
