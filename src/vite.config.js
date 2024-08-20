import { defineConfig } from "vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
  build: {
    sourcemap: true, // Source map generation must be turned on
  },
  plugins: [
    // Put the Sentry vite plugin after all other plugins
    sentryVitePlugin({
      org: "niklas",
      project: "chatify",
      authToken: import.meta.env.SENTRY_AUTH_TOKEN,
    }),
  ],
});
