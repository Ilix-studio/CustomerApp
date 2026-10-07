import { Stack, useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return (
    <>
      <Stack.Screen options={{ title: slug }} />
      <PlaceholderScreen title={slug} message="Items from local sellers will show up here." />
    </>
  );
}
