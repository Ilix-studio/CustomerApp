import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { formatCurrency } from '@/config/app-config';
import { palette, radii, shadows, sizes, space } from '@/constants/tokens';

type FreeDeliveryBarProps = {
  threshold: number;
  onDismiss: () => void;
};

export function FreeDeliveryBar({ threshold, onDismiss }: FreeDeliveryBarProps) {
  return (
    <View style={styles.bar}>
      <View style={styles.iconCircle}>
        <Icon name="bike" size={22} color="brand" />
      </View>
      <View style={styles.copy}>
        <AppText variant="deliveryTitle">Get FREE delivery</AppText>
        <AppText variant="deliverySubtitle" color="textMuted">
          on orders above {formatCurrency(threshold)}
        </AppText>
      </View>
      <Pressable
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel="Dismiss free delivery offer"
        style={({ pressed }) => [styles.dismiss, pressed && styles.pressed]}>
        <Icon name="x" size={18} color="textMuted" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.sm + 2,
    paddingLeft: space.md,
    paddingRight: space.sm + 2,
    borderRadius: radii.card,
    backgroundColor: palette.surface,
    boxShadow: shadows.floating,
  },
  iconCircle: {
    width: sizes.deliveryIcon,
    height: sizes.deliveryIcon,
    borderRadius: radii.full,
    backgroundColor: palette.brandTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
  },
  dismiss: {
    width: sizes.touch,
    height: sizes.touch,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});
