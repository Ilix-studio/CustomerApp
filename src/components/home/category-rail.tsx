import { StyleSheet, View } from 'react-native';

import { space, tileTints } from '@/constants/tokens';
import type { Product, ProductRail } from '@/data/types';
import { chunk } from '@/utils/chunk';

import { ProductTile, ProductTileSkeleton } from './product-tile';
import { SectionHeader, SectionHeaderSkeleton } from './section-header';

const COLUMNS = 4;
const MAX_ITEMS = COLUMNS * 2;

type CategoryRailProps = {
  rail: ProductRail;
  onSeeAll: (rail: ProductRail) => void;
  onSelectProduct: (product: Product, rail: ProductRail) => void;
};

export function CategoryRail({ rail, onSeeAll, onSelectProduct }: CategoryRailProps) {
  const tint = tileTints[rail.tint];
  const rows = chunk(rail.items.slice(0, MAX_ITEMS), COLUMNS);

  return (
    <View style={styles.section}>
      <SectionHeader title={rail.title} onSeeAll={() => onSeeAll(rail)} />
      <View style={styles.grid}>
        {rows.map((row) => (
          <View key={row[0].id} style={styles.row}>
            {row.map((product) => (
              <ProductTile
                key={product.id}
                product={product}
                tint={tint}
                onPress={(p) => onSelectProduct(p, rail)}
              />
            ))}
            {Array.from({ length: COLUMNS - row.length }, (_, i) => (
              <View key={`pad-${i}`} style={styles.filler} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

export function CategoryRailSkeleton() {
  return (
    <View style={styles.section}>
      <SectionHeaderSkeleton />
      <View style={styles.grid}>
        {[0, 1].map((r) => (
          <View key={r} style={styles.row}>
            {Array.from({ length: COLUMNS }, (_, c) => (
              <ProductTileSkeleton key={c} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: space.sm,
  },
  grid: {
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  filler: {
    flex: 1,
  },
});
