import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFloatingBottomInset } from '@/components/navigation/floating-bottom-area';
import { palette, space } from '@/constants/tokens';

/** Standard scroll container for catalog screens: gutter, gap and the floating-bar bottom inset. */
export function ScreenScroll({ children, insetTop = false }: { children: ReactNode; insetTop?: boolean }) {
  const insets = useSafeAreaInsets();
  const bottomInset = useFloatingBottomInset();
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: (insetTop ? insets.top : 0) + space.lg, paddingBottom: Math.max(bottomInset, insets.bottom + space.lg) },
      ]}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.bg },
  content: { paddingHorizontal: space.gutter, gap: space.md },
});
