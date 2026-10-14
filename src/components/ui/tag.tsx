import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { planTints, radii, serviceTints, space } from '@/constants/tokens';

export type TagTone = 'mint' | 'plan' | 'rx';

const tones = {
  mint: { background: planTints.ai.mint, text: planTints.ai.background },
  plan: { background: planTints.plan.tagBackground, text: planTints.plan.ink },
  rx: { background: serviceTints.medicines.background, text: serviceTints.medicines.title },
} as const satisfies Record<TagTone, { background: string; text: string }>;

/** Text tag that rides alongside every colour-coded surface (AI, Plan, Rx). */
export function Tag({ tone, label }: { tone: TagTone; label: string }) {
  const { background, text } = tones[tone];
  return (
    <View style={[styles.tag, { backgroundColor: background }]}>
      <AppText variant="pill" color={text}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: space.sm,
    paddingVertical: space.xxs,
    borderRadius: radii.full,
  },
});
