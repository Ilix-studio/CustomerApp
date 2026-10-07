import { mockHomeFeed } from './mock-home-feed';
import type { HomeFeed } from './types';

const MOCK_LATENCY_MS = 700;

/** Swap the body for a real request (e.g. `fetch(`${API_URL}/home`)`) when the backend exists. */
export async function fetchHomeFeed(): Promise<HomeFeed> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
  return mockHomeFeed;
}
