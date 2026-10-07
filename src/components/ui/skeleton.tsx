import { useEffect } from 'react';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { palette, type PaletteColor } from '@/constants/tokens';

type SkeletonProps = {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  tone?: PaletteColor;
  style?: StyleProp<ViewStyle>;
};

export function Skeleton({ width, height, radius = 8, tone = 'border', style }: SkeletonProps) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.45, { duration: 800 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      accessible={false}
      style={[
        { width, height, borderRadius: radius, backgroundColor: palette[tone] },
        animatedStyle,
        style,
      ]}
    />
  );
}
