import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { palette, radii } from '@/constants/tokens';

import { AppText } from './app-text';

export function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'solid',
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'solid' | 'outline';
}) {
  const inactive = disabled || loading;
  const solid = variant === 'solid';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      className="active:opacity-85"
      style={[styles.base, solid ? styles.solid : styles.outline, inactive && { opacity: 0.5 }]}>
      {loading ? (
        <ActivityIndicator color={solid ? palette.onBrand : palette.brand} />
      ) : (
        <AppText variant="button" color={solid ? 'onBrand' : 'brand'}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 52, borderRadius: radii.search, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  solid: { backgroundColor: palette.brand, borderColor: palette.brand },
  outline: { backgroundColor: palette.surface, borderColor: palette.border },
});
