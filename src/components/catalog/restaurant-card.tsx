import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { palette, radii, space } from '@/constants/tokens';
import { formatCurrency } from '@/config/app-config';
import type { Restaurant } from '@/data/catalog/types';

/** A closed kitchen has to be obvious before anyone builds an order in it. */
export function RestaurantCard({ restaurant: r }: { restaurant: Restaurant }) {
  return (
    <Pressable
      disabled={!r.isOpen}
      onPress={() => router.push({ pathname: '/restaurant/[id]', params: { id: r.id } })}
      accessibilityRole="button"
      accessibilityLabel={`${r.name}${r.isOpen ? '' : ', closed now'}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={[styles.media, !r.isOpen && styles.shut]}>
        <Image source={r.image} contentFit="cover" style={styles.image} accessible={false} />
        {!r.isOpen && (
          <View style={styles.shutTag}>
            <AppText variant="pill" color="onBrand">
              Closed now
            </AppText>
          </View>
        )}
      </View>
      <View style={styles.head}>
        <AppText variant="cardTitle" style={styles.name}>
          {r.name}
        </AppText>
        <View style={styles.rating} accessible accessibilityLabel={`Rated ${r.rating} out of 5 from ${r.ratingCount} ratings`}>
          <Icon name="star" size={14} color="accent" />
          <AppText variant="label">{r.rating}</AppText>
          <AppText variant="label" color="textMuted">
            ({r.ratingCount})
          </AppText>
        </View>
      </View>
      <AppText variant="caption" color="textMuted">
        {r.cuisine}
      </AppText>
      <View style={styles.chips}>
        {r.signatureDishes.map((dish) => (
          <View key={dish} style={styles.chip}>
            <AppText variant="label">{dish}</AppText>
          </View>
        ))}
      </View>
      <AppText variant="caption" color="textMuted">
        {r.prepMinutes} min · {formatCurrency(r.priceForTwo)} for two
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: palette.border,
    padding: space.md,
    gap: space.sm,
  },
  pressed: { opacity: 0.85 },
  media: { aspectRatio: 2, borderRadius: radii.tile, overflow: 'hidden', backgroundColor: palette.brandTint },
  shut: { opacity: 0.55 },
  image: { width: '100%', height: '100%' },
  shutTag: {
    position: 'absolute',
    top: space.sm,
    left: space.sm,
    backgroundColor: palette.inkDark,
    paddingHorizontal: space.sm,
    paddingVertical: space.xxs,
    borderRadius: radii.full,
  },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space.sm },
  name: { flex: 1 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  chip: { paddingHorizontal: space.md, paddingVertical: space.xs, borderRadius: radii.full, backgroundColor: palette.brandTint },
});
