/** A failed API call. `status` is 0 when the server could not be reached at all. */
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  /** The server's own message, if it sent one. Safe to show. */
  readonly serverMessage?: string;

  constructor(status: number, serverMessage?: string, code?: string) {
    super(serverMessage ?? `Request failed (${status}).`);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.serverMessage = serverMessage;
  }
}

export const NETWORK_MESSAGE = 'Cannot reach the server. Check your connection.';

/** The server's message for a failed call, a connection message, or the fallback. Safe to show. */
export function errorMessage(error: unknown, fallback = 'Something went wrong. Try again.'): string {
  if (error instanceof ApiError) {
    if (error.status === 0) return NETWORK_MESSAGE;
    return error.serverMessage ?? fallback;
  }
  return fallback;
}
