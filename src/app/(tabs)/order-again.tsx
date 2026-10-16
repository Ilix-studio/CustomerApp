import { Link } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ScreenScroll } from '@/components/catalog/screen-scroll';
import { AppText } from '@/components/ui/app-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { formatCurrency } from '@/config/app-config';
import { palette, radii, space } from '@/constants/tokens';
import { useCartDraft } from '@/hooks/use-cart-draft';
import { useMyOrders, type OrderDto, type OrderStatus } from '@/api/customer';
import { useAppSelector } from '@/store/hooks';
import { useProducts } from '@/api/products';
import { selectIsAuthenticated } from '@/store/slices/auth-slice';

/** Status is always spelled out, never colour alone. */
const STATUS_LABEL: Record<OrderStatus, string> = {
  placed: 'Placed. Waiting for the shop',
  accepted: 'Accepted by the shop',
  packing: 'Being packed',
  ready: 'Packed. Waiting for a driver',
  out_for_delivery: 'On the way',
  delivered: 'Delivered',
  rejected: 'The shop could not take this order',
};

/** New orders move through the shop and driver quickly, so keep this list fresh while it is on screen. */
const POLL_MS = 20_000;

function OrderCard({ order }: { order: OrderDto }) {
  const cart = useCartDraft();
  const { data: products } = useProducts();

  /** Puts the order's items back in the cart, capped at what is in stock now. */
  function orderAgain() {
    for (const item of order.items) {
      const product = products?.find((p) => p.id === item.productId);
      if (!product) continue;
      const variant = item.variantId ? product.variants?.find((v) => v.id === item.variantId) : undefined;
      const stock = variant ? variant.stockCount : (product.stockCount ?? 0);
      for (let i = 0; i < item.quantity; i++) cart.increment(item.productId, stock, item.variantId);
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <AppText variant="cardTitle">#{order.number}</AppText>
        <AppText variant="cardTitle">{formatCurrency(order.total)}</AppText>
      </View>
      {order.merchant ? (
        <AppText variant="caption" color="textMuted">
          {order.merchant.name}
        </AppText>
      ) : null}
      <AppText variant="body" color={order.status === 'rejected' ? 'badge' : 'brand'}>
        {STATUS_LABEL[order.status]}
      </AppText>
      {order.items.map((i, idx) => (
        <AppText key={`${i.productId}-${i.variantId ?? ''}-${idx}`} variant="body" color="textMuted">
          {i.quantity} × {i.name}
        </AppText>
      ))}
      {order.status === 'delivered' || order.status === 'rejected' ? (
        <PrimaryButton label="Order again" variant="outline" onPress={orderAgain} />
      ) : null}
    </View>
  );
}

export default function OrderAgainScreen() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: orders, isLoading, isError, refetch } = useMyOrders({
    enabled: isAuthenticated,
    refetchInterval: POLL_MS,
  });

  return (
    <ScreenScroll insetTop>
      <AppText variant="hero" accessibilityRole="header">
        Your orders
      </AppText>

      {!isAuthenticated ? (
        <Link href="/sign-in?redirect=/order-again" asChild>
          <AppText variant="link" color="brand" accessibilityRole="link">
            Sign in to see your orders.
          </AppText>
        </Link>
      ) : isLoading ? (
        <ActivityIndicator color={palette.brand} />
      ) : isError || !orders ? (
        <AppText variant="body" color="textMuted" onPress={() => void refetch()} accessibilityRole="button">
          Couldn&apos;t load your orders. Tap to try again.
        </AppText>
      ) : orders.length === 0 ? (
        <AppText variant="body" color="textMuted">
          No orders yet. They show up here once you place one.
        </AppText>
      ) : (
        orders.map((o) => <OrderCard key={o.id} order={o} />)
      )}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: palette.border,
    padding: space.lg,
    gap: space.xs,
  },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
