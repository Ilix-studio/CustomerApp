import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { radii, space, type TileTint } from '@/constants/tokens';
import type { Product } from '@/data/types';

type ProductTileProps = {
  product: Product;
  tint: TileTint;
  onPress: (product: Product) => void;
};

export function ProductTile({ product, tint, onPress }: ProductTileProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = product.image != null && !imageFailed;

  return (
    <Pressable
      onPress={() => onPress(product)}
      accessibilityRole="button"
      accessibilityLabel={product.name}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}>
      <View style={[styles.imageBox, { backgroundColor: tint.background }]}>
        {showImage ? (
          <Image
            source={product.image}
            contentFit="contain"
            style={styles.image}
            onError={() => setImageFailed(true)}
            accessible={false}
          />
        ) : (
          <Icon name={product.icon} size={30} color={tint.icon} />
        )}
      </View>
      <AppText variant="label" numberOfLines={2} style={styles.label}>
        {product.name}
      </AppText>
    </Pressable>
  );
}

export function ProductTileSkeleton() {
  return (
    <View style={styles.tile}>
      <Skeleton radius={radii.tile} style={styles.imageBox} />
      <Skeleton width="70%" height={10} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: space.xs + 2,
  },
  imageBox: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radii.tile,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '84%',
    height: '84%',
  },
  label: {
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});
