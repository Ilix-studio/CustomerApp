import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { radii, serviceTints, sizes, space } from '@/constants/tokens';
import type { ServiceCategory } from '@/data/types';

type ServiceCardProps = {
  service: ServiceCategory;
  onPress: (service: ServiceCategory) => void;
};

export function ServiceCard({ service, onPress }: ServiceCardProps) {
  const tint = serviceTints[service.tint];

  return (
    <Pressable
      onPress={() => onPress(service)}
      accessibilityRole="link"
      accessibilityLabel={`${service.title}. ${service.subtitle}`}
      className="active:opacity-85"
      style={[styles.card, { backgroundColor: tint.background }]}>
      <Icon name={service.icon} size={sizes.serviceIcon} color={tint.title} />
      <View style={styles.copy}>
        <AppText variant="cardTitle" color={tint.title}>
          {service.title}
        </AppText>
        <AppText variant="caption" color={tint.subtitle} numberOfLines={1}>
          {service.subtitle}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: sizes.serviceCardMinHeight,
    borderRadius: radii.card,
    padding: space.lg,
    justifyContent: 'space-between',
    gap: space.md,
  },
  copy: {
    gap: space.xs,
  },
});
