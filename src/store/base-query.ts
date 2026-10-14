import { fetchBaseQuery, type BaseQueryFn } from '@reduxjs/toolkit/query/react';

import { appConfig } from '@/config/app-config';

import { logout, selectToken } from './slices/auth-slice';

/** Error `code`s the backend uses for a missing, expired or invalid token. Key off these, never message text. */
const AUTH_ERROR_CODES = new Set(['UNAUTHENTICATED', 'TOKEN_EXPIRED', 'TOKEN_INVALID']);

/** Backend envelope: `{ success, message, data }`; errors are `{ success: false, message, code? }`. */
export type Envelope<T> = { success: boolean; message: string; data: T };

type AuthState = Parameters<typeof selectToken>[0];

const rawBaseQuery = fetchBaseQuery({
  baseUrl: appConfig.apiUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = selectToken(getState() as AuthState);
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

/** Adds the bearer token and logs the user out on any auth-expiry error code. */
export const baseQueryWithAuthGuard: BaseQueryFn = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  const code = (result.error?.data as { code?: string } | undefined)?.code;
  if (code && AUTH_ERROR_CODES.has(code)) api.dispatch(logout());

  return result;
};
