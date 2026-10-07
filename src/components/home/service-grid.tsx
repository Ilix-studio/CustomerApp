import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/components/ui/skeleton';
import { radii, sizes, space } from '@/constants/tokens';
import type { ServiceCategory } from '@/data/types';
import { chunk } from '@/utils/chunk';

import { ServiceCard } from './service-card';
import { SectionHeader, SectionHeaderSkeleton } from './section-header';

const COLUMNS = 2;

type ServiceGridProps = {
  title: string;
  services: ServiceCategory[];
  onSelect: (service: ServiceCategory) => void;
};

export function ServiceGrid({ title, services, onSelect }: ServiceGridProps) {
  return (
    <View style={styles.section}>
      <SectionHeader title={title} />
      <View style={styles.grid}>
        {chunk(services, COLUMNS).map((row) => (
          <View key={row.map((s) => s.id).join()} style={styles.row}>
            {row.map((service) => (
              <ServiceCard key={service.id} service={service} onPress={onSelect} />
            ))}
            {row.length < COLUMNS ? <View style={styles.filler} /> : null}
          </View>
        ))}
      </View>
    </View>
  );
}

export function ServiceGridSkeleton() {
  return (
    <View style={styles.section}>
      <SectionHeaderSkeleton />
      <View style={styles.grid}>
        {[0, 1].map((r) => (
          <View key={r} style={styles.row}>
            {[0, 1].map((c) => (
              <Skeleton
                key={c}
                height={sizes.serviceCardMinHeight}
                radius={radii.card}
                style={styles.filler}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: space.sm,
  },
  grid: {
    gap: space.md,
  },
  row: {
    flexDirection: 'row',
    gap: space.md,
  },
  filler: {
    flex: 1,
  },
});
