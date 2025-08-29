import * as Sentry from "@sentry/react-native";

export const initializeCrashReporting = () => {
  if (!__DEV__) {
    // Only in production builds
    Sentry.init({
      dsn: "YOUR_SENTRY_DSN", // Get this from sentry.io
      environment: "production",
      enableAutoSessionTracking: true,
      debug: false,
    });
  }
};

export const captureError = (error: Error, context?: any) => {
  if (!__DEV__) {
    Sentry.captureException(error, { extra: context });
  }
  console.error("Error captured:", error, context);
};
