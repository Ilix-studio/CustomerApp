import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { palette, radii, sizes, space } from '@/constants/tokens';
import type { CategoryChip } from '@/data/types';

type CategoryChipsProps = {
  chips: CategoryChip[];
  selectedId: string;
  onSelect: (chip: CategoryChip) => void;
};

export function CategoryChips({ chips, selectedId, onSelect }: CategoryChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.strip}
      accessibilityRole="tablist">
      {chips.map((chip) => {
        const selected = chip.id === selectedId;
        const color = selected ? 'onBrand' : 'onBrandMuted';
        return (
          <Pressable
            key={chip.id}
            onPress={() => onSelect(chip)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={chip.badge ? `${chip.label}, ${chip.badge}` : chip.label}
            className="active:opacity-70"
            style={styles.chip}>
            <View>
              <Icon name={chip.icon} size={sizes.chipIcon} color={color} />
              {chip.badge ? (
                <View style={styles.badge}>
                  <AppText variant="badge" color="onBrand">
                    {chip.badge}
                  </AppText>
                </View>
              ) : null}
            </View>
            <AppText variant={selected ? 'labelSelected' : 'label'} color={color} numberOfLines={1}>
              {chip.label}
            </AppText>
            <View style={[styles.underline, selected && styles.underlineSelected]} />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export function CategoryChipsSkeleton() {
  return (
    <View style={[styles.strip, styles.skeletonRow]}>
      {Array.from({ length: 5 }, (_, i) => (
        <View key={i} style={styles.chip}>
          <Skeleton width={sizes.chipIcon} height={sizes.chipIcon} radius={radii.full} tone="onBrandOverlay" />
          <Skeleton width={48} height={10} tone="onBrandOverlay" />
          <View style={styles.underline} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    paddingHorizontal: space.gutter - space.xs,
  },
  skeletonRow: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  chip: {
    width: sizes.chipWidth,
    alignItems: 'center',
    gap: space.xs + 2,
    paddingTop: space.xs,
  },
  badge: {
    position: 'absolute',
    top: -6,
    left: sizes.chipIcon - 8,
    paddingHorizontal: space.xs,
    paddingVertical: 1,
    borderRadius: radii.full,
    backgroundColor: palette.badge,
  },
  underline: {
    width: sizes.underlineWidth,
    height: sizes.underlineHeight,
    marginTop: space.xs,
    borderTopLeftRadius: sizes.underlineHeight,
    borderTopRightRadius: sizes.underlineHeight,
  },
  underlineSelected: {
    backgroundColor: palette.accent,
  },
});
