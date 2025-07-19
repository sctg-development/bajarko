import { getCommonMeta, mergeMeta } from '@libs/util/meta';
import { getRootLoader } from '@libs/util/server/root.server';
import { useRef } from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  ShouldRevalidateFunction,
  useLoaderData,
  useRouteError,
} from 'react-router';
import { MetaFunction } from 'react-router';
import { Page } from './components/layout/Page';
import { RootProviders } from './providers/root-providers';

import '@app/styles/global.css';
import { useRootLoaderData } from './hooks/useRootLoaderData';

export const getRootMeta: MetaFunction = ({ data }) => {
  const title = 'Barrio Store';
  const description = 'Discover our artisan-roasted coffee, crafted with care and delivered to your door.';
  const ogTitle = title;
  const ogDescription = description;
  const ogImage = '';
  const ogImageAlt = !!ogImage ? `${ogTitle} logo` : undefined;

  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: ogTitle },
    { property: 'og:description', content: ogDescription },
    { property: 'og:image', content: ogImage },
    { property: 'og:image:alt', content: ogImageAlt },
  ];
};

export const meta: MetaFunction<typeof loader> = mergeMeta(getCommonMeta, getRootMeta);

export const loader = getRootLoader;

export const shouldRevalidate: ShouldRevalidateFunction = ({
  actionResult,
  currentParams,
  currentUrl,
  defaultShouldRevalidate,
  formAction,
  formData,
  formEncType,
  formMethod,
  nextParams,
  nextUrl,
}) => {
  if (nextUrl.pathname.startsWith('/checkout/success')) return true;
  if (!formMethod || formMethod === 'GET') return false;

  return defaultShouldRevalidate;
};

function App() {
  const headRef = useRef<HTMLHeadElement>(null);
  const data = useRootLoaderData();

  const { env = {}, siteDetails } = data || {};

  return (
    <RootProviders>
      <html lang="en" className="min-h-screen">
        <head ref={headRef}>
          <meta charSet="UTF-8" />
          <Meta />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Italiana&display=swap" rel="stylesheet" />

          <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Ballet:opsz@16..72&display=swap" rel="stylesheet" />

          <link href="https://fonts.googleapis.com/css2?family=Sen:wght@400..800&display=swap" rel="stylesheet" />

          <link href="https://fonts.googleapis.com/css2?family=Aboreto&display=swap" rel="stylesheet" />
          <Links />
          {siteDetails?.settings?.description && <meta name="description" content={siteDetails.settings.description} />}
        </head>
        <body className="min-h-screen">
          <Page>
            <Outlet />
          </Page>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(env)}`,
            }}
          />
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </RootProviders>
  );
}

export default App;

export function ErrorBoundary() {
  const error = useRouteError();

  console.error('error boundary error', error);

  // Handle 404 errors gracefully - don't crash the whole app
  if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
    console.warn('404 error handled gracefully:', error);

    return (
      <html>
        <head>
          <title>Page Not Found</title>
          <Meta />
          <Links />
        </head>
        <body>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900">404</h1>
              <p className="text-gray-600 mt-4">The page you're looking for doesn't exist.</p>
              <a href="/" className="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded">
                Go Home
              </a>
            </div>
          </div>
          <Scripts />
        </body>
      </html>
    );
  }

  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">Something went wrong</h1>
            <p className="text-gray-600 mt-4">An error occurred while loading this page.</p>
            <a href="/" className="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded">
              Go Home
            </a>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
