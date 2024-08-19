import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "https://<YOUR_SENTRY_DSN>@oXXXXXX.ingest.sentry.io/XXXXXXX", // Replace with your DSN
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
