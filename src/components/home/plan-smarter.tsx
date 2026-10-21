import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Tag } from '@/components/ui/tag';
import { planTints, radii, sizes, space } from '@/constants/tokens';

import { SectionHeader } from './section-header';

export type PlanFocus = 'daily' | 'festive';

type PlanSmarterProps = {
  onOpenDietPlanner: () => void;
  onOpenPlan: (focus: PlanFocus) => void;
};

const planTiles: { focus: PlanFocus; title: string; icon: IconName }[] = [
  { focus: 'daily', title: 'Daily Ration + Wallet', icon: 'calendar' },
  { focus: 'festive', title: 'Occasional Order', icon: 'gift' },
];

export function PlanSmarter({ onOpenDietPlanner, onOpenPlan }: PlanSmarterProps) {
  return (
    <View style={styles.section}>
      <SectionHeader title="Plan smarter" />

      <Pressable
        onPress={onOpenDietPlanner}
        accessibilityRole="link"
        accessibilityLabel="AI Diet Planner. Upload a diet plan, get a ready-to-order list"
        className="active:opacity-85"
        style={styles.ai}>
        <View style={styles.aiMark}>
          <Icon name="sparkles" size={sizes.planMark} color={planTints.ai.mint} />
        </View>
        <View style={styles.aiBody}>
          <View style={styles.aiTitleRow}>
            <AppText variant="cardTitle" color="onBrand">
              AI Diet Planner
            </AppText>
            <Tag tone="mint" label="AI" />
          </View>
          <AppText variant="caption" color={planTints.ai.subtitle}>
            Upload a diet plan, get a ready-to-order list
          </AppText>
        </View>
        <Icon name="arrow-right" size={sizes.planMark} color={planTints.ai.mint} />
      </Pressable>

      <View style={styles.plans}>
        {planTiles.map((tile) => (
          <Pressable
            key={tile.focus}
            onPress={() => onOpenPlan(tile.focus)}
            accessibilityRole="link"
            accessibilityLabel={`${tile.title}. Plan`}
            className="active:opacity-85"
            style={styles.plan}>
            <View style={styles.planTop}>
              <Icon name={tile.icon} size={sizes.planMark} color={planTints.plan.ink} />
              <Tag tone="plan" label="PLAN" />
            </View>
            <AppText variant="cardTitle" color={planTints.plan.ink}>
              {tile.title}
            </AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: space.sm,
  },
  ai: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    padding: space.lg,
    borderRadius: radii.tile,
    backgroundColor: planTints.ai.background,
  },
  aiMark: {
    width: sizes.planMarkBox,
    height: sizes.planMarkBox,
    borderRadius: radii.search,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: planTints.ai.mark,
  },
  aiBody: {
    flex: 1,
    gap: space.xs,
  },
  aiTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  plans: {
    flexDirection: 'row',
    gap: space.md,
  },
  plan: {
    flex: 1,
    minHeight: sizes.touch,
    padding: space.lg,
    gap: space.md,
    borderRadius: radii.tile,
    borderWidth: 1,
    borderColor: planTints.plan.border,
    backgroundColor: planTints.plan.background,
  },
  planTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
