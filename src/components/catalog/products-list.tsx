import { ActivityIndicator } from 'react-native';

import { ProductCard } from '@/components/catalog/product-card';
import { AppText } from '@/components/ui/app-text';
import { palette } from '@/constants/tokens';
import { useProducts } from '@/api/products';

/** Products for one category from the live API, with loading and error states. */
export function ProductsList({ category, subCategory, emptyText }: { category: string; subCategory?: string; emptyText?: string }) {
  const { data, isLoading, isError, refetch } = useProducts({ category, subCategory });

  if (isLoading) return <ActivityIndicator color={palette.brand} />;
  if (isError || !data) {
    return (
      <AppText variant="body" color="textMuted" onPress={() => void refetch()} accessibilityRole="button">
        Couldn&apos;t load items. Tap to try again.
      </AppText>
    );
  }
  if (data.length === 0) {
    return (
      <AppText variant="body" color="textMuted">
        {emptyText ?? 'Nothing here yet.'}
      </AppText>
    );
  }
  return data.map((product) => <ProductCard key={product.id} product={product} />);
}
