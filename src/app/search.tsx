import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function SearchScreen() {
  const { q, voice } = useLocalSearchParams<{ q?: string; voice?: string }>();
  const message = voice
    ? 'Voice search is coming soon.'
    : q
      ? `Results for "${q}" will show up here.`
      : undefined;
  return <PlaceholderScreen title="Search" message={message} />;
}
