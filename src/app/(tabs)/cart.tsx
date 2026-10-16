import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { QuantityControl } from '@/components/catalog/quantity-control';
import { ScreenScroll } from '@/components/catalog/screen-scroll';
import { AppText } from '@/components/ui/app-text';
import { palette, radii, space } from '@/constants/tokens';
import { formatCurrency } from '@/config/app-config';
import { useCartDraft } from '@/hooks/use-cart-draft';
import { useAppSelector } from '@/store/hooks';
import { useProducts } from '@/api/products';
import { selectIsAuthenticated } from '@/store/slices/auth-slice';

export default function CartScreen() {
  const cart = useCartDraft();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: products, isLoading } = useProducts();

  const rows = Object.values(cart.lines).flatMap((line) => {
    const product = products?.find((p) => p.id === line.productId);
    if (!product) return [];
    const variant = line.variantId ? product.variants?.find((v) => v.id === line.variantId) : undefined;
    return [
      {
        line,
        product,
        price: variant ? variant.price : (product.price ?? 0),
        stock: variant ? variant.stockCount : (product.stockCount ?? 0),
        name: variant ? `${product.name}, ${variant.label}` : product.name,
      },
    ];
  });
  const subtotal = rows.reduce((sum, r) => sum + r.price * r.line.quantity, 0);

  const onCheckout = () => {
    // Auth and checkout screens arrive in later slices; routes are untyped until then.
    router.push((isAuthenticated ? '/checkout' : '/sign-in?redirect=/checkout') as never);
  };

  return (
    <ScreenScroll insetTop>
      <AppText variant="hero" accessibilityRole="header">
        Your cart
      </AppText>
      <AppText variant="body" color="textMuted">
        {cart.totalItems === 0 ? 'Nothing in here yet.' : `${cart.totalItems} ${cart.totalItems === 1 ? 'item' : 'items'}`}
      </AppText>

      {isLoading ? (
        <ActivityIndicator color={palette.brand} />
      ) : rows.length === 0 ? (
        <Pressable onPress={() => router.navigate('/')} accessibilityRole="button">
          <AppText variant="link" color="brand">
            Your cart is empty. Go shopping.
          </AppText>
        </Pressable>
      ) : (
        <>
          {rows.map(({ line, product, price, stock, name }) => (
            <View key={`${line.productId}::${line.variantId ?? ''}`} style={styles.row}>
              <Image source={product.image} contentFit="cover" style={styles.thumb} accessible={false} />
              <View style={styles.rowBody}>
                <AppText variant="cardTitle" numberOfLines={2}>
                  {name}
                </AppText>
                <AppText variant="body">{formatCurrency(price)}</AppText>
              </View>
              <QuantityControl
                quantity={line.quantity}
                max={stock}
                label={name}
                onIncrement={() => cart.increment(line.productId, stock, line.variantId)}
                onDecrement={() => cart.decrement(line.productId, line.variantId)}
              />
            </View>
          ))}
          <View style={styles.summary}>
            <AppText variant="cardTitle">Subtotal: {formatCurrency(subtotal)}</AppText>
            <Pressable onPress={onCheckout} accessibilityRole="button" style={styles.checkout}>
              <AppText variant="button" color="onBrand">
                Checkout
              </AppText>
            </Pressable>
          </View>
        </>
      )}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, backgroundColor: palette.surface, borderRadius: radii.card, borderWidth: 1, borderColor: palette.border, padding: space.md },
  thumb: { width: 56, height: 56, borderRadius: radii.search, backgroundColor: palette.brandTint },
  rowBody: { flex: 1, gap: space.xxs },
  summary: { gap: space.md, marginTop: space.sm },
  checkout: { minHeight: 52, borderRadius: radii.search, backgroundColor: palette.brand, alignItems: 'center', justifyContent: 'center' },
});
