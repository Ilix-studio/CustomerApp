import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ScreenScroll } from '@/components/catalog/screen-scroll';
import { AppText } from '@/components/ui/app-text';
import { palette, radii, space } from '@/constants/tokens';
import { formatCurrency } from '@/config/app-config';
import { useGetRestaurantQuery } from '@/store/customer-api';

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: r, isLoading } = useGetRestaurantQuery(id);

  if (isLoading) {
    return (
      <ScreenScroll>
        <ActivityIndicator color={palette.brand} />
      </ScreenScroll>
    );
  }

  if (!r) {
    return (
      <ScreenScroll>
        <Stack.Screen options={{ title: 'Restaurant' }} />
        <AppText variant="hero">Restaurant not found</AppText>
        <Link href={{ pathname: '/category/[slug]', params: { slug: 'food' } }}>
          <AppText variant="link" color="brand">
            Browse the food aisle
          </AppText>
        </Link>
      </ScreenScroll>
    );
  }

  return (
    <ScreenScroll>
      <Stack.Screen options={{ title: r.name }} />
      <AppText variant="hero" accessibilityRole="header">
        {r.name}
      </AppText>
      <AppText variant="body" color="textMuted">
        {r.cuisine}
      </AppText>
      <AppText variant="body">
        ★ {r.rating} ({r.ratingCount}) · {r.prepMinutes} min · {formatCurrency(r.priceForTwo)} for two
        {r.isOpen ? '' : ' · Closed now'}
      </AppText>
      <AppText variant="h2">Signature dishes</AppText>
      <View style={styles.chips}>
        {r.signatureDishes.map((dish) => (
          <View key={dish} style={styles.chip}>
            <AppText variant="label">{dish}</AppText>
          </View>
        ))}
      </View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  chip: { paddingHorizontal: space.md, paddingVertical: space.xs, borderRadius: radii.full, backgroundColor: palette.brandTint },
});
