import { AppText } from '@/components/ui/app-text';
import { LOW_STOCK_THRESHOLD } from '@/data/catalog/restaurants';

/** Three states, each in words so colour is never the only signal. */
export function StockLine({ stockCount }: { stockCount: number }) {
  if (stockCount === 0) {
    return (
      <AppText variant="label" color="badge">
        Out of stock
      </AppText>
    );
  }
  if (stockCount <= LOW_STOCK_THRESHOLD) {
    return (
      <AppText variant="label" color="badge">
        Only {stockCount} left
      </AppText>
    );
  }
  return (
    <AppText variant="label" color="textMuted">
      {stockCount} in stock
    </AppText>
  );
}
