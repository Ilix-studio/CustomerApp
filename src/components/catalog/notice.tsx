import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { palette, radii, space } from '@/constants/tokens';

export function Notice({ text }: { text: string }) {
  return (
    <View style={styles.box} accessibilityRole="alert">
      <Icon name="triangle-alert" size={18} color="brand" />
      <AppText variant="caption" style={styles.text}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    gap: space.sm,
    padding: space.md,
    borderRadius: radii.tile,
    backgroundColor: palette.brandTint,
  },
  text: { flex: 1 },
});
