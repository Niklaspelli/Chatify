import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "https://6c1f935c82494e05dd9ef7ea37706a04@o4507804386852864.ingest.us.sentry.io/4507804548857856", // Replace with your DSN
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,

  // Optional: Attach user information to events
  beforeSend(event) {
    // Modify event before it is sent to Sentry
    return event;
  },
});
