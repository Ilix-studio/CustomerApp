import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator } from 'react-native';

import { ProductCard } from '@/components/catalog/product-card';
import { ScreenScroll } from '@/components/catalog/screen-scroll';
import { AppText } from '@/components/ui/app-text';
import { palette } from '@/constants/tokens';
import { useProducts } from '@/api/products';

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useProducts();
  const product = data?.find((p) => p.id === id);

  return (
    <ScreenScroll>
      <Stack.Screen options={{ title: product?.name ?? 'Product' }} />
      {isLoading ? (
        <ActivityIndicator color={palette.brand} />
      ) : product ? (
        <ProductCard product={product} />
      ) : (
        <AppText variant="body" color="textMuted">
          We couldn&apos;t find that item.
        </AppText>
      )}
    </ScreenScroll>
  );
}
