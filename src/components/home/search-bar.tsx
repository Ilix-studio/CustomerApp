import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { appConfig } from '@/config/app-config';
import { palette, radii, sizes, space, typography } from '@/constants/tokens';

type SearchBarProps = {
  hints: string[];
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: (query: string) => void;
  onVoicePress: () => void;
};

export function SearchBar({ hints, value, onChangeText, onSubmit, onVoicePress }: SearchBarProps) {
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    if (hints.length < 2) return;
    const id = setInterval(
      () => setHintIndex((i) => (i + 1) % hints.length),
      appConfig.searchHintIntervalMs
    );
    return () => clearInterval(id);
  }, [hints.length]);

  const hint = hints[hintIndex % Math.max(hints.length, 1)];
  const placeholder = hint ? `Search "${hint}"` : 'Search products and shops';

  return (
    <View style={styles.bar}>
      <Icon name="search" size={20} color="textMuted" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={() => onSubmit(value)}
        placeholder={placeholder}
        placeholderTextColor={palette.textMuted}
        accessibilityLabel="Search products and shops"
        returnKeyType="search"
        autoCorrect={false}
        style={styles.input}
      />
      <View style={styles.divider} />
      <Pressable
        onPress={onVoicePress}
        accessibilityRole="button"
        accessibilityLabel="Search by voice"
        hitSlop={4}
        style={({ pressed }) => [styles.mic, pressed && styles.pressed]}>
        <Icon name="mic" size={20} color="brand" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: sizes.searchHeight,
    borderRadius: radii.search,
    backgroundColor: palette.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: space.md + 2,
    paddingRight: space.xs,
    gap: space.sm + 2,
  },
  input: {
    ...typography.search,
    flex: 1,
    height: '100%',
    color: palette.text,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: palette.divider,
  },
  mic: {
    width: sizes.touch,
    height: sizes.touch,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});
