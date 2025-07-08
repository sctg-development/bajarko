import { createCookie } from 'react-router';
import { config } from './config.server';
import { getCookie } from './cookies.server';

export const authCookie = createCookie(config.AUTH_COOKIE_NAME);

type AuthHeaders = { authorization: string } | {};

export const getAuthHeaders = async (request: Partial<Request>): Promise<AuthHeaders> => {
  if (!request.headers) {
    throw Error('No request provided for getting auth headers');
  }

  const token = await getCookie(request.headers, authCookie);

  if (!token) {
    return {};
  }

  return { authorization: `Bearer ${token}` };
};

export const withAuthHeaders = <TArgs extends Array<any> = any[], TReturn = any>(
  asyncFn: (request: Request, authHeaders: AuthHeaders, ...args: TArgs) => TReturn,
) => {
  return async (request: Request, ...args: TArgs): Promise<Awaited<TReturn>> => {
    const authHeaders = await getAuthHeaders(request);

    return await asyncFn(request, authHeaders, ...args);
  };
};
