import { Link, Redirect, router, Stack } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ScreenScroll } from '@/components/catalog/screen-scroll';
import { AppText } from '@/components/ui/app-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { formatCurrency } from '@/config/app-config';
import { palette, radii, space } from '@/constants/tokens';
import { useCartDraft } from '@/hooks/use-cart-draft';
import { useAddresses, useCreateOrder, type PaymentMethod } from '@/api/customer';
import { errorMessage } from '@/api/errors';
import { useProducts } from '@/api/products';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/auth-slice';
import { clearCart } from '@/store/slices/cart-slice';

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 'gpay', label: 'Google Pay' },
  { value: 'phonepe', label: 'PhonePe' },
];

function Choice({ selected, onPress, title, subtitle }: { selected: boolean; onPress: () => void; title: string; subtitle?: string }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={[styles.choice, selected && styles.choiceSelected]}>
      <AppText variant="cardTitle" color={selected ? 'brand' : 'text'}>
        {title}
      </AppText>
      {subtitle ? (
        <AppText variant="caption" color="textMuted">
          {subtitle}
        </AppText>
      ) : null}
    </Pressable>
  );
}

export default function CheckoutScreen() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const cart = useCartDraft();
  const { data: products } = useProducts();
  const { data: addresses, isLoading: loadingAddresses } = useAddresses({ enabled: isAuthenticated });
  const createOrder = useCreateOrder();
  const placing = createOrder.isPending;

  const [addressId, setAddressId] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentMethod>('gpay');
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) return <Redirect href={'/sign-in?redirect=/checkout' as never} />;

  const lines = Object.values(cart.lines);
  // The server prices the order; this total is only what the shopper sees before placing it.
  const subtotal = lines.reduce((sum, line) => {
    const product = products?.find((p) => p.id === line.productId);
    const price = line.variantId ? product?.variants?.find((v) => v.id === line.variantId)?.price : product?.price;
    return sum + (price ?? 0) * line.quantity;
  }, 0);

  const chosen = addressId ?? addresses?.[0]?.id ?? null;

  async function place() {
    if (!chosen) return;
    setError(null);
    try {
      await createOrder.mutateAsync({
        addressId: chosen,
        paymentMethod: payment,
        items: lines.map((l) => ({ productId: l.productId, variantId: l.variantId, quantity: l.quantity })),
      });
      dispatch(clearCart());
      router.replace('/order-again');
    } catch (e) {
      setError(errorMessage(e, 'Could not place the order.'));
    }
  }

  return (
    <ScreenScroll>
      <Stack.Screen options={{ title: 'Checkout' }} />
      <AppText variant="hero" accessibilityRole="header">
        Checkout
      </AppText>

      {lines.length === 0 ? (
        <AppText variant="body" color="textMuted">
          Your cart is empty.
        </AppText>
      ) : (
        <>
          <AppText variant="h2">Deliver to</AppText>
          {loadingAddresses ? (
            <ActivityIndicator color={palette.brand} />
          ) : addresses && addresses.length > 0 ? (
            addresses.map((a) => (
              <Choice
                key={a.id}
                selected={a.id === chosen}
                onPress={() => setAddressId(a.id)}
                title={a.label}
                subtitle={`${a.line1}, ${a.city} ${a.pincode}`}
              />
            ))
          ) : (
            <Link href="/address" asChild>
              <AppText variant="link" color="brand" accessibilityRole="link">
                Add a delivery address to continue.
              </AppText>
            </Link>
          )}

          <AppText variant="h2">Pay with</AppText>
          <View style={styles.row}>
            {PAYMENT_OPTIONS.map((o) => (
              <View key={o.value} style={styles.fill}>
                <Choice selected={o.value === payment} onPress={() => setPayment(o.value)} title={o.label} />
              </View>
            ))}
          </View>

          <AppText variant="cardTitle">
            {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} · {formatCurrency(subtotal)}
          </AppText>
          {error ? (
            <AppText variant="caption" color="badge" accessibilityRole="alert">
              {error}
            </AppText>
          ) : null}
          <PrimaryButton label="Place order" onPress={place} loading={placing} disabled={!chosen} />
        </>
      )}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  row: { flexDirection: 'row', gap: space.md },
  choice: {
    backgroundColor: palette.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: palette.border,
    padding: space.lg,
    gap: space.xxs,
  },
  choiceSelected: { borderColor: palette.brand, backgroundColor: palette.brandTint },
});
