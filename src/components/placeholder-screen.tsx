import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFloatingBottomInset } from '@/components/navigation/floating-bottom-area';
import { AppText } from '@/components/ui/app-text';
import { palette, space } from '@/constants/tokens';

type PlaceholderScreenProps = {
  title: string;
  message?: string;
  /** Tab screens draw under the status bar and need the top inset themselves. */
  insetTop?: boolean;
};

/** Stand-in for screens the home design links to but DESIGN.md doesn't specify yet. */
export function PlaceholderScreen({ title, message, insetTop = false }: PlaceholderScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = useFloatingBottomInset();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: (insetTop ? insets.top : 0) + space.xl,
          paddingBottom: Math.max(bottomInset, insets.bottom + space.lg),
        },
      ]}>
      <AppText variant="hero" accessibilityRole="header">
        {title}
      </AppText>
      <AppText variant="body" color="textMuted">
        {message ?? 'This screen is coming soon.'}
      </AppText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  content: {
    paddingHorizontal: space.gutter,
    gap: space.sm,
  },
});
