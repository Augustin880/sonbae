import { ApiContentRepository } from '@/data/ApiContentRepository';
import { StaticContentRepository } from '@/data/StaticContentRepository';
import { createAnalyticsService } from '@/services/analyticsService';
import { createDemoAuthService } from '@/services/authService';
import type { AppServices } from '@/services/AppProvider';
import { runtimeConfig } from '@/config/runtimeConfig';

export function createAppServices(): AppServices {
  const contentRepository =
    runtimeConfig.contentSource === 'api'
      ? new ApiContentRepository(runtimeConfig.apiBaseUrl)
      : new StaticContentRepository();

  return {
    contentRepository,
    auth: createDemoAuthService(),
    analytics: createAnalyticsService(runtimeConfig.analyticsEnabled),
  };
}
