import { Text, type TextProps } from 'react-native';

import { palette, typography, type PaletteColor, type TypographyVariant } from '@/constants/tokens';

export type AppTextProps = TextProps & {
  variant?: TypographyVariant;
  /** A palette token, or a raw color from a tint table in tokens.ts. */
  color?: PaletteColor | (string & {});
};

export function AppText({ variant = 'body', color = 'text', style, ...rest }: AppTextProps) {
  const resolved = color in palette ? palette[color as PaletteColor] : color;
  return <Text style={[typography[variant], { color: resolved }, style]} {...rest} />;
}
