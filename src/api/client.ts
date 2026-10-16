import { appConfig } from '@/config/app-config';
import { logout, selectToken } from '@/store/slices/auth-slice';
import { store } from '@/store/store';

import { ApiError, NETWORK_MESSAGE } from './errors';

/** Error `code`s the backend uses for a missing, expired or invalid token. Key off these, never message text. */
const AUTH_ERROR_CODES = new Set(['UNAUTHENTICATED', 'TOKEN_EXPIRED', 'TOKEN_INVALID']);

/** Backend envelope: `{ success, message, data }`; errors are `{ success: false, message, code? }`. */
export type Envelope<T> = { success: boolean; message: string; data: T };

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  params?: Record<string, string | undefined>;
  signal?: AbortSignal;
};

/**
 * The one place that talks to localMart-BE: adds the bearer token, parses JSON and throws an ApiError on
 * failure. An auth-expiry error code signs the customer out. Query functions and mutations call this.
 */
export async function apiRequest<T>(path: string, { method = 'GET', body, params, signal }: RequestOptions = {}): Promise<T> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) if (value !== undefined) query.set(key, value);
  const queryString = query.toString();
  const url = `${appConfig.apiUrl}${path}${queryString ? `?${queryString}` : ''}`;

  const headers: Record<string, string> = { Accept: 'application/json' };
  const token = selectToken(store.getState());
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let response: Response;
  try {
    response = await fetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal });
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') throw e;
    throw new ApiError(0, NETWORK_MESSAGE);
  }

  let json: unknown = null;
  try {
    json = await response.json();
  } catch {
    // An empty or non-JSON body: handled below by status.
  }

  if (!response.ok) {
    const failure = json as { message?: string; code?: string } | null;
    if (failure?.code && AUTH_ERROR_CODES.has(failure.code)) store.dispatch(logout());
    throw new ApiError(response.status, failure?.message, failure?.code);
  }
  return json as T;
}
