type Env = {
  VITE_APP_ENV?: string;
  VITE_API_BASE_URL?: string;
  VITE_ANALYTICS_ENABLED?: string;
  VITE_CONTENT_SOURCE?: string;
};

export const env = import.meta.env as Env;
