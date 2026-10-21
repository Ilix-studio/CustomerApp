import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { palette, radii, sizes, space } from '@/constants/tokens';

type QuantityControlProps = {
  quantity: number;
  /** Stock on hand; the plus stops here. */
  max: number;
  /** Names the product for screen readers, e.g. "Tomato, 500 g". */
  label: string;
  onIncrement: () => void;
  onDecrement: () => void;
};

/** A single Add button until something is in the cart, then a stepper. */
export function QuantityControl({ quantity, max, label, onIncrement, onDecrement }: QuantityControlProps) {
  if (max === 0) {
    return (
      <View style={[styles.add, styles.disabled]}>
        <AppText variant="button" color="textMuted">
          Sold out
        </AppText>
      </View>
    );
  }

  if (quantity === 0) {
    return (
      <Pressable
        onPress={onIncrement}
        accessibilityRole="button"
        accessibilityLabel={`Add ${label}`}
        className="active:opacity-85"
        style={styles.add}>
        <Icon name="plus" size={16} color="onBrand" />
        <AppText variant="button" color="onBrand">
          Add
        </AppText>
      </Pressable>
    );
  }

  const atMax = quantity >= max;
  return (
    <View style={styles.stepper} accessibilityRole="adjustable" accessibilityLabel={`Quantity, ${label}`}>
      <Pressable
        onPress={onDecrement}
        accessibilityRole="button"
        accessibilityLabel={`Remove one ${label}`}
        style={styles.stepBtn}>
        <Icon name="minus" size={18} color="onBrand" />
      </Pressable>
      <AppText variant="button" color="onBrand" accessibilityLiveRegion="polite" style={styles.count}>
        {quantity}
      </AppText>
      <Pressable
        onPress={onIncrement}
        disabled={atMax}
        accessibilityRole="button"
        accessibilityLabel={`Add one more ${label}`}
        style={[styles.stepBtn, atMax && styles.dim]}>
        <Icon name="plus" size={18} color="onBrand" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  add: {
    minHeight: sizes.touch,
    paddingHorizontal: space.lg,
    borderRadius: radii.search,
    backgroundColor: palette.brand,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
  },
  disabled: { backgroundColor: palette.border },
  stepper: {
    minHeight: sizes.touch,
    borderRadius: radii.search,
    backgroundColor: palette.brand,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepBtn: { width: sizes.touch, height: sizes.touch, alignItems: 'center', justifyContent: 'center' },
  count: { minWidth: 20, textAlign: 'center' },
  dim: { opacity: 0.4 },
});
