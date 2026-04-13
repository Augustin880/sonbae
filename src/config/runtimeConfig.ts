import { env } from '@/config/env';

export type RuntimeConfig = {
  appEnv: string;
  apiBaseUrl: string;
  analyticsEnabled: boolean;
  contentSource: 'static' | 'api';
};

export const runtimeConfig: RuntimeConfig = {
  appEnv: env.VITE_APP_ENV ?? 'demo',
  apiBaseUrl: env.VITE_API_BASE_URL ?? '/api',
  analyticsEnabled: env.VITE_ANALYTICS_ENABLED === 'true',
  contentSource: env.VITE_CONTENT_SOURCE === 'api' ? 'api' : 'static',
};
