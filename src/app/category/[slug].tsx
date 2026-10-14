import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Notice } from '@/components/catalog/notice';
import { ProductsList } from '@/components/catalog/products-list';
import { RestaurantCard } from '@/components/catalog/restaurant-card';
import { ScreenScroll } from '@/components/catalog/screen-scroll';
import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { Tag } from '@/components/ui/tag';
import { palette, radii, space } from '@/constants/tokens';
import { CATEGORIES } from '@/data/catalog/categories';
import { useGetRestaurantsQuery } from '@/store/customer-api';

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const category = CATEGORIES.find((c) => c.slug === slug);
  const { data: restaurants, isLoading: loadingRestaurants, isError: restaurantsFailed, refetch } =
    useGetRestaurantsQuery(undefined, { skip: slug !== 'food' });

  if (!category) {
    return (
      <ScreenScroll>
        <Stack.Screen options={{ title: 'Category' }} />
        <AppText variant="hero">Category not found</AppText>
        <AppText variant="body" color="textMuted">
          We don&apos;t have a &quot;{slug}&quot; aisle.
        </AppText>
      </ScreenScroll>
    );
  }

  return (
    <ScreenScroll>
      <Stack.Screen options={{ title: category.title }} />
      <View style={styles.head}>
        <View style={styles.icon}>
          <Icon name={category.icon} size={24} color="brand" />
        </View>
        <View style={styles.headText}>
          <AppText variant="h2" accessibilityRole="header">
            {category.title}
          </AppText>
          <AppText variant="caption" color="textMuted">
            {category.subtitle}
          </AppText>
        </View>
      </View>

      {category.notice && <Notice text={category.notice} />}

      {category.slug === 'food' &&
        (loadingRestaurants ? (
          <ActivityIndicator color={palette.brand} />
        ) : restaurantsFailed || !restaurants ? (
          <AppText variant="body" color="textMuted" onPress={refetch} accessibilityRole="button">
            Couldn&apos;t load restaurants. Tap to try again.
          </AppText>
        ) : restaurants.length === 0 ? (
          <AppText variant="body" color="textMuted">
            No kitchens yet.
          </AppText>
        ) : (
          restaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)
        ))}

      {category.slug === 'medicine' && (
        <>
          <View style={styles.rx}>
            <View style={styles.rxHead}>
              <AppText variant="cardTitle">Prescription medicines</AppText>
              <Tag tone="rx" label="RX" />
            </View>
            <AppText variant="body" color="textMuted">
              Upload a photo or PDF of your prescription. A licensed pharmacist checks it before anything is
              dispensed, and will call you if a substitution is needed.
            </AppText>
            <Pressable
              onPress={() => router.push('/prescription/upload' as never)}
              accessibilityRole="button"
              style={styles.rxBtn}>
              <Icon name="upload" size={18} color="onBrand" />
              <AppText variant="button" color="onBrand">
                Upload prescription
              </AppText>
            </Pressable>
          </View>
          <AppText variant="h2">Over-the-counter</AppText>
          <AppText variant="caption" color="textMuted">
            No prescription needed here.
          </AppText>
        </>
      )}

      {category.slug !== 'food' && <ProductsList category={category.slug} />}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  headText: { flex: 1 },
  icon: { width: 48, height: 48, borderRadius: radii.full, backgroundColor: palette.brandTint, alignItems: 'center', justifyContent: 'center' },
  rx: { backgroundColor: palette.surface, borderRadius: radii.card, borderWidth: 1, borderColor: palette.border, padding: space.lg, gap: space.md },
  rxHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  rxBtn: { minHeight: 48, borderRadius: radii.search, backgroundColor: palette.brand, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm },
});
