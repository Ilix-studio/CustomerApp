import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { formatCurrency } from '@/config/app-config';
import { palette, radii, sizes, space } from '@/constants/tokens';
import type { SavedAddress } from '@/state/app-state';

type HeaderProps = {
  address: SavedAddress;
  walletBalance: number;
  onLocationPress: () => void;
  onWalletPress: () => void;
  onProfilePress: () => void;
};

/** Top row of the brand header: eyebrow, hero line, location console, wallet + profile. */
export function Header({
  address,
  walletBalance,
  onLocationPress,
  onWalletPress,
  onProfilePress,
}: HeaderProps) {
  const addressText = `${address.label} · ${address.line}`;
  const balance = formatCurrency(walletBalance);

  return (
    <View style={styles.row}>
      <View style={styles.titleColumn}>
        <AppText variant="eyebrow" color="accent">
          Local Mart
        </AppText>
        <AppText variant="hero" color="onBrand" accessibilityRole="header">
          From shops near you
        </AppText>
        <Pressable
          onPress={onLocationPress}
          accessibilityRole="button"
          accessibilityLabel={`Delivery location: ${addressText}`}
          accessibilityHint="Opens address picker"
          className="active:opacity-75"
          style={styles.location}>
          <Icon name="map-pin" size={18} color="onBrand" />
          <AppText variant="body" color="onBrand" numberOfLines={1} style={styles.locationText}>
            {addressText}
          </AppText>
          <Icon name="chevron-down" size={18} color="onBrand" />
        </Pressable>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={onWalletPress}
          accessibilityRole="button"
          accessibilityLabel={`Wallet, balance ${balance}`}
          className="active:opacity-75"
          style={styles.walletButton}>
          <Icon name="wallet" size={22} color="onBrand" />
          <View style={styles.balancePill}>
            <AppText variant="pill" color="onBrand" numberOfLines={1}>
              {balance}
            </AppText>
          </View>
        </Pressable>
        <Pressable
          onPress={onProfilePress}
          accessibilityRole="button"
          accessibilityLabel="Profile"
          className="active:opacity-75"
          style={styles.profileButton}>
          <Icon name="user" size={22} color="brand" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.md,
  },
  titleColumn: {
    flex: 1,
    gap: space.xs,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    maxWidth: '100%',
    minHeight: sizes.touch,
    gap: space.xs + 2,
  },
  locationText: {
    flexShrink: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: space.sm + 2,
    paddingTop: space.xs,
  },
  walletButton: {
    width: sizes.headerButton,
    height: sizes.headerButton,
    borderRadius: radii.full,
    backgroundColor: palette.onBrandOverlay,
    borderWidth: 1.5,
    borderColor: palette.onBrandOverlayBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balancePill: {
    position: 'absolute',
    bottom: -9,
    alignSelf: 'center',
    minWidth: 28,
    paddingHorizontal: space.sm - 2,
    paddingVertical: space.xxs,
    borderRadius: radii.full,
    backgroundColor: palette.inkDark,
    alignItems: 'center',
  },
  profileButton: {
    width: sizes.headerButton,
    height: sizes.headerButton,
    borderRadius: radii.full,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
