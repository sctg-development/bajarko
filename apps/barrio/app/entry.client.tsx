// https://github.com/remix-run/remix/issues/2947

import * as Sentry from '@sentry/remix';
import { StrictMode, startTransition } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

declare global {
  interface Window {
    ENV: any;
  }
}

if (window?.ENV?.SENTRY_DSN)
  Sentry.init({
    dsn: window?.ENV?.SENTRY_DSN,
    environment: window?.ENV?.SENTRY_ENVIRONMENT,
    integrations: [],
  });

const hydrate = () =>
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <HydratedRouter />
      </StrictMode>,
    );
  });

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}
