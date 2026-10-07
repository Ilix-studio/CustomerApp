import { TabTrigger, type TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { palette, radii, shadows, sizes, space } from '@/constants/tokens';

/** Tab routes; names must match the hidden <TabList> in src/app/(tabs)/_layout.tsx. */
export const navTabs = [
  { name: 'home', href: '/', label: 'Home', icon: 'house' },
  { name: 'order-again', href: '/order-again', label: 'Order Again', icon: 'rotate-ccw' },
  { name: 'categories', href: '/categories', label: 'Categories', icon: 'layout-grid' },
  { name: 'cart', href: '/cart', label: 'Cart', icon: 'shopping-cart' },
] as const satisfies readonly { name: string; href: string; label: string; icon: IconName }[];

type BottomNavProps = {
  cartCount: number;
};

export function BottomNav({ cartCount }: BottomNavProps) {
  return (
    <View style={styles.nav} accessibilityRole="tablist">
      {navTabs.map((tab) => (
        <TabTrigger key={tab.name} name={tab.name} asChild>
          <NavItem
            label={tab.label}
            icon={tab.icon}
            badgeCount={tab.name === 'cart' ? cartCount : 0}
          />
        </TabTrigger>
      ))}
    </View>
  );
}

type NavItemProps = TabTriggerSlotProps & {
  label: string;
  icon: IconName;
  badgeCount: number;
};

function NavItem({ label, icon, badgeCount, isFocused, ...pressableProps }: NavItemProps) {
  const color = isFocused ? 'brand' : 'textNav';
  const a11yLabel = badgeCount > 0 ? `${label}, ${badgeCount} items` : label;

  return (
    <Pressable
      {...pressableProps}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={a11yLabel}
      style={({ pressed }) => [styles.item, isFocused && styles.itemActive, pressed && styles.pressed]}>
      <View>
        <Icon name={icon} size={sizes.navIcon} color={color} />
        {badgeCount > 0 ? (
          <View style={styles.badge}>
            <AppText variant="badge" color="onBrand">
              {badgeCount > 99 ? '99+' : badgeCount}
            </AppText>
          </View>
        ) : null}
      </View>
      <AppText variant={isFocused ? 'labelActive' : 'label'} color={color} numberOfLines={1}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    padding: space.xs + 2,
    gap: space.xs,
    borderRadius: radii.nav,
    backgroundColor: palette.surface,
    boxShadow: shadows.floating,
  },
  item: {
    flex: 1,
    minHeight: 56,
    borderRadius: radii.navItem,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xxs + 1,
    paddingVertical: space.sm - 2,
  },
  itemActive: {
    backgroundColor: palette.brandTint,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: space.xs,
    borderRadius: radii.full,
    backgroundColor: palette.badge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
