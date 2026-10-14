import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { QuantityControl } from '@/components/catalog/quantity-control';
import { StockLine } from '@/components/catalog/stock-line';
import { AppText } from '@/components/ui/app-text';
import { palette, radii, space } from '@/constants/tokens';
import type { CatalogProduct } from '@/data/catalog/types';
import { useCartDraft } from '@/hooks/use-cart-draft';
import { resolveCartAction } from '@/lib/cart';
import { formatCurrency } from '@/config/app-config';

/**
 * One product: sized items pick a variant first (price and stock follow the variant),
 * fixed packs show their own. Rx items route to the prescription flow instead of the cart.
 */
export function ProductCard({ product }: { product: CatalogProduct & { showStock?: boolean } }) {
  // Stock status only means something once stock is connected; until then every item
  // is listed without it.
  const showStock = product.showStock ?? true;
  const cart = useCartDraft();
  const variants = product.variants ?? [];
  // Open on the first size with stock so the card doesn't land on a sold-out one.
  const [variantId, setVariantId] = useState(() => (variants.find((v) => v.stockCount > 0) ?? variants[0])?.id);
  const variant = variants.find((v) => v.id === variantId) ?? variants[0];

  const price = variant?.price ?? product.price ?? 0;
  const stock = variant?.stockCount ?? product.stockCount ?? 0;
  const quantity = cart.quantityOf(product.id, variant?.id);
  const label = variant ? `${product.name}, ${variant.label}` : product.name;
  const action = resolveCartAction({
    productId: product.id,
    name: product.name,
    requiresPrescription: product.requiresPrescription,
  });

  return (
    <View style={styles.card}>
      <Pressable
        onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}
        accessibilityRole="button"
        accessibilityLabel={product.name}>
        <View style={[styles.media, showStock && stock === 0 && styles.dimmed]}>
          <Image source={product.image} contentFit="cover" style={styles.image} accessible={false} />
        </View>
        <AppText variant="cardTitle" numberOfLines={2} style={styles.name}>
          {product.name}
        </AppText>
      </Pressable>
      {(product.origin ?? product.useFor ?? product.pack) ? (
        <AppText variant="caption" color="textMuted">
          {product.origin ?? product.useFor}
          {product.pack && !variant ? `${product.origin ?? product.useFor ? ' · ' : ''}${product.pack}` : ''}
        </AppText>
      ) : null}

      {variants.length > 1 && (
        <View style={styles.sizes}>
          {variants.map((v) => (
            <Pressable
              key={v.id}
              onPress={() => setVariantId(v.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: v.id === variant?.id }}
              style={[styles.size, v.id === variant?.id && styles.sizeSelected]}>
              <AppText variant="label" color={v.id === variant?.id ? 'onBrand' : 'text'}>
                {v.label}
                {showStock && v.stockCount === 0 ? ' (sold out)' : ''}
              </AppText>
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.foot}>
        <View style={styles.priceBox}>
          <AppText variant="cardTitle">{formatCurrency(price)}</AppText>
          {showStock ? <StockLine stockCount={stock} /> : null}
        </View>
        {action.kind === 'prescription' ? (
          <Pressable
            onPress={() => router.push('/prescription/upload' as never)}
            accessibilityRole="button"
            style={styles.rxBtn}>
            <AppText variant="button" color="brand">
              {action.label}
            </AppText>
          </Pressable>
        ) : (
          <QuantityControl
            quantity={quantity}
            max={stock}
            label={label}
            onIncrement={() => cart.increment(product.id, stock, variant?.id)}
            onDecrement={() => cart.decrement(product.id, variant?.id)}
          />
        )}
      </View>
    </View>
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
  media: {
    aspectRatio: 1.6,
    borderRadius: radii.tile,
    backgroundColor: palette.brandTint,
    overflow: 'hidden',
  },
  dimmed: { opacity: 0.45 },
  image: { width: '100%', height: '100%' },
  name: { marginTop: space.sm },
  sizes: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  size: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: palette.border,
  },
  sizeSelected: { backgroundColor: palette.brand, borderColor: palette.brand },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.md },
  priceBox: { flex: 1 },
  rxBtn: {
    paddingHorizontal: space.lg,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: radii.search,
    borderWidth: 1,
    borderColor: palette.brand,
  },
});
