// Temporarily disable Sentry to avoid request loops
// import * as Sentry from '@sentry/nextjs';

export async function register() {
  // Sentry disabled for now
  // if (process.env.NEXT_RUNTIME === 'nodejs') {
  //   await import('../sentry.server.config');
  // }
  // if (process.env.NEXT_RUNTIME === 'edge') {
  //   await import('../sentry.edge.config');
  // }
}

// export const onRequestError = Sentry.captureRequestError;
