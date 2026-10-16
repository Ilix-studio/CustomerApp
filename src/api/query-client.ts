import { focusManager, QueryClient } from '@tanstack/react-query';
import { AppState, Platform } from 'react-native';

import { ApiError } from './errors';

/**
 * Server data lives here (TanStack Query); Redux keeps only client state (sign-in, cart). Nothing in this
 * cache is persisted, and it is cleared on sign-out so the next customer never sees it.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      // Retry only what may be temporary: no connection, or a server error. A 4xx will not change.
      retry: (failureCount, error) => failureCount < 2 && !(error instanceof ApiError && error.status >= 400 && error.status < 500),
    },
    mutations: { retry: false },
  },
});

// On native there is no window focus; treat the app coming to the foreground as focus.
if (Platform.OS !== 'web') {
  focusManager.setEventListener((handleFocus) => {
    const subscription = AppState.addEventListener('change', (state) => handleFocus(state === 'active'));
    return () => subscription.remove();
  });
}
