// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

// Temporarily disable Sentry in development to avoid request loops
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://beb2ebfa5017f647b634b8006ec12f8b@o4509403854929920.ingest.us.sentry.io/4509407249760256',

    // Add optional integrations for additional features
    integrations: [Sentry.replayIntegration()],

    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 0.1,

    // Define how likely Replay events are sampled.
    replaysSessionSampleRate: 0.1,

    // Define how likely Replay events are sampled when an error occurs.
    replaysOnErrorSampleRate: 1.0,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
  });
}

export const onRouterTransitionStart =
  process.env.NODE_ENV === 'production' ? Sentry.captureRouterTransitionStart : () => {};
