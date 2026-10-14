import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { palette, radii, sizes, space, typography } from '@/constants/tokens';

import { AppText } from './app-text';

export function TextField({ label, ...rest }: TextInputProps & { label: string }) {
  return (
    <View style={styles.wrap}>
      <AppText variant="label" color="textMuted">
        {label}
      </AppText>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={palette.textMuted}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xs },
  input: {
    ...typography.search,
    minHeight: sizes.touch,
    paddingHorizontal: space.md,
    borderRadius: radii.search,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    color: palette.text,
  },
});
