import { useEffect, useState } from 'react';

import { fetchHomeFeed } from '@/data/home-api';
import type { HomeFeed } from '@/data/types';

type HomeFeedState =
  | { status: 'loading'; feed: null }
  | { status: 'error'; feed: null }
  | { status: 'ready'; feed: HomeFeed };

export function useHomeFeed() {
  const [state, setState] = useState<HomeFeedState>({ status: 'loading', feed: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchHomeFeed().then(
      (feed) => !cancelled && setState({ status: 'ready', feed }),
      () => !cancelled && setState({ status: 'error', feed: null })
    );
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = () => {
    setState({ status: 'loading', feed: null });
    setAttempt((n) => n + 1);
  };

  return { ...state, retry };
}
