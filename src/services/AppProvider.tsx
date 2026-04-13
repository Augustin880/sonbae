import { createContext, useContext, type PropsWithChildren } from 'react';
import type { ContentRepository } from '@/data/ContentRepository';
import type { AnalyticsService } from '@/services/analyticsService';
import type { AuthService } from '@/services/authService';

export type AppServices = {
  contentRepository: ContentRepository;
  auth: AuthService;
  analytics: AnalyticsService;
};

const AppContext = createContext<AppServices | null>(null);

type AppProviderProps = PropsWithChildren<{
  services: AppServices;
}>;

export function AppProvider({ children, services }: AppProviderProps) {
  return <AppContext.Provider value={services}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppServices() {
  const services = useContext(AppContext);

  if (!services) {
    throw new Error('useAppServices must be used inside AppProvider.');
  }

  return services;
}
