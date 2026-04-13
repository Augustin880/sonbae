export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, string | number | boolean>;
};

export type AnalyticsService = {
  track(event: AnalyticsEvent): void;
};

export function createAnalyticsService(enabled: boolean): AnalyticsService {
  return {
    track(event) {
      if (!enabled) {
        return;
      }

      console.info('[analytics]', event);
    },
  };
}
