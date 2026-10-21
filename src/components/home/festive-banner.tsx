import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Skeleton } from '@/components/ui/skeleton';
import { palette, radii, sizes, space } from '@/constants/tokens';
import type { FestiveBannerContent } from '@/data/types';

type FestiveBannerProps = {
  banner: FestiveBannerContent;
  onPress: (banner: FestiveBannerContent) => void;
};

export function FestiveBanner({ banner, onPress }: FestiveBannerProps) {
  return (
    <View style={styles.banner}>
      <View style={styles.copy}>
        <AppText variant="eyebrow" color="accentInk">
          {banner.eyebrow}
        </AppText>
        <AppText variant="bannerTitle" color="accentInk">
          {banner.title}
        </AppText>
        <AppText variant="caption" color="accentInk">
          {banner.subtitle}
        </AppText>
      </View>
      <Pressable
        onPress={() => onPress(banner)}
        accessibilityRole="button"
        accessibilityLabel={`${banner.ctaLabel}: ${banner.title}`}
        className="active:opacity-80"
        style={styles.cta}>
        <AppText variant="button" color="onBrand">
          {banner.ctaLabel}
        </AppText>
      </Pressable>
    </View>
  );
}

export function FestiveBannerSkeleton() {
  return <Skeleton height={124} radius={radii.card} />;
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: palette.accent,
    borderRadius: radii.card,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  copy: {
    flex: 1,
    gap: space.xs,
  },
  cta: {
    height: sizes.touch,
    paddingHorizontal: space.xl,
    borderRadius: radii.full,
    backgroundColor: palette.accentInk,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
