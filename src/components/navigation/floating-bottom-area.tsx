import { usePathname } from 'expo-router';
import { createContext, use, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { appConfig } from '@/config/app-config';
import { space } from '@/constants/tokens';
import { useAppState } from '@/state/app-state';

import { BottomNav } from './bottom-nav';
import { FreeDeliveryBar } from './free-delivery-bar';

/** Space screens must leave at the bottom of their scroll content so nothing hides behind the bars. */
const FloatingInsetContext = createContext(0);

export function useFloatingBottomInset() {
  return use(FloatingInsetContext);
}

export function FloatingBottomAreaProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { cartCount, deliveryBarDismissed, dismissDeliveryBar } = useAppState();
  const [areaHeight, setAreaHeight] = useState(0);

  const bottomOffset = Math.max(insets.bottom, space.floatingMargin);
  const showDeliveryBar = pathname === '/' && !deliveryBarDismissed;

  return (
    <FloatingInsetContext value={areaHeight + bottomOffset + space.lg}>
      {children}
      <View
        pointerEvents="box-none"
        onLayout={(e) => setAreaHeight(e.nativeEvent.layout.height)}
        style={[styles.area, { bottom: bottomOffset }]}>
        {showDeliveryBar ? (
          <FreeDeliveryBar
            threshold={appConfig.freeDeliveryThreshold}
            onDismiss={dismissDeliveryBar}
          />
        ) : null}
        <BottomNav cartCount={cartCount} />
      </View>
    </FloatingInsetContext>
  );
}

const styles = StyleSheet.create({
  area: {
    position: 'absolute',
    left: space.floatingMargin,
    right: space.floatingMargin,
    gap: space.floatingGap,
  },
});
