import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Skeleton } from '@/components/ui/skeleton';
import { sizes } from '@/constants/tokens';

type SectionHeaderProps = {
  title: string;
  onSeeAll?: () => void;
};

export function SectionHeader({ title, onSeeAll }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <AppText variant="h2" accessibilityRole="header" style={styles.title}>
        {title}
      </AppText>
      {onSeeAll ? (
        <Pressable
          onPress={onSeeAll}
          accessibilityRole="link"
          accessibilityLabel={`See all ${title}`}
          className="active:opacity-60"
          style={styles.seeAll}>
          <AppText variant="link" color="brand">
            See all
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

export function SectionHeaderSkeleton() {
  return (
    <View style={styles.row}>
      <Skeleton width={160} height={20} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: sizes.touch,
  },
  title: {
    flexShrink: 1,
  },
  seeAll: {
    minHeight: sizes.touch,
    paddingLeft: 12,
    justifyContent: 'center',
  },
});
