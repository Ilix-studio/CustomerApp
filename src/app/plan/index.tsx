import { useLocalSearchParams } from 'expo-router';

import { PlaceholderScreen } from '@/components/placeholder-screen';

/** Step 2 builds the ration + festive-kit cards. `focus` picks which one opens first. */
export default function PlanScreen() {
  const { focus } = useLocalSearchParams<{ focus?: 'daily' | 'festive' }>();
  const message =
    focus === 'festive'
      ? 'Occasion ration kits will show up here.'
      : 'Daily ration and wallet planning will show up here.';
  return <PlaceholderScreen title="Plan" message={message} />;
}
