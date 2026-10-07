/**
 * Local Mart design tokens — source of truth is DESIGN.md §1.
 * Components must read colors, type, spacing and radii from here; never hard-code hex values.
 */

import type { TextStyle } from 'react-native';

export const palette = {
  brand: '#1E4D3A',
  brandTint: '#E6F0E1',
  accent: '#F4B23E',
  accentInk: '#2A1A04',
  bg: '#F6F4EE',
  surface: '#FFFFFF',
  text: '#1B1D1A',
  textMuted: '#4D514B',
  textNav: '#3E423C',
  onBrand: '#FFFFFF',
  onBrandMuted: '#E4EEE8',
  onBrandOverlay: 'rgba(255,255,255,0.12)',
  onBrandOverlayBorder: 'rgba(255,255,255,0.35)',
  border: '#DEDCD5',
  divider: '#D9D7D0',
  badge: '#D9412B',
  inkDark: '#141613',
} as const;

export type PaletteColor = keyof typeof palette;

export type ServiceTint = { background: string; title: string; subtitle: string };

export const serviceTints = {
  produce: { background: '#DDEFD9', title: '#173B12', subtitle: '#2E5527' },
  shops: { background: '#FBE5C8', title: '#4A2A05', subtitle: '#6A4512' },
  medicines: { background: '#D8E7F5', title: '#0F2E4C', subtitle: '#24476A' },
  services: { background: '#E8DFF3', title: '#34184F', subtitle: '#50316E' },
} as const satisfies Record<string, ServiceTint>;

export type ServiceTintKey = keyof typeof serviceTints;

export type TileTint = { background: string; icon: string };

export const tileTints = {
  vegetables: { background: '#E6F0E1', icon: '#3F6B35' },
  livestock: { background: '#F5E3DC', icon: '#8A3B22' },
  snacks: { background: '#FBEBC9', icon: '#8A5A0B' },
} as const satisfies Record<string, TileTint>;

export type TileTintKey = keyof typeof tileTints;

/** Shadow for floating bars. RN 0.76+ supports the CSS `boxShadow` string on native and web. */
export const shadows = {
  floating: '0 4px 18px rgba(20,30,20,0.12)',
} as const;

/** Plus Jakarta Sans, one family per weight (custom fonts can't rely on fontWeight on Android). */
export const fontFamilies = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
} as const;

const eyebrowTracking = 12 * 0.08;

export const typography = {
  hero: { fontFamily: fontFamilies.extrabold, fontSize: 26, lineHeight: 30 },
  h2: { fontFamily: fontFamilies.extrabold, fontSize: 20, lineHeight: 26 },
  bannerTitle: { fontFamily: fontFamilies.extrabold, fontSize: 22, lineHeight: 25 },
  cardTitle: { fontFamily: fontFamilies.extrabold, fontSize: 17, lineHeight: 20 },
  body: { fontFamily: fontFamilies.medium, fontSize: 15, lineHeight: 20 },
  search: { fontFamily: fontFamilies.medium, fontSize: 16 },
  caption: { fontFamily: fontFamilies.medium, fontSize: 13, lineHeight: 17 },
  deliveryTitle: { fontFamily: fontFamilies.extrabold, fontSize: 15, lineHeight: 19 },
  deliverySubtitle: { fontFamily: fontFamilies.regular, fontSize: 13, lineHeight: 17 },
  link: { fontFamily: fontFamilies.bold, fontSize: 14, lineHeight: 18 },
  button: { fontFamily: fontFamilies.bold, fontSize: 15, lineHeight: 19 },
  label: { fontFamily: fontFamilies.semibold, fontSize: 12, lineHeight: 15 },
  labelSelected: { fontFamily: fontFamilies.bold, fontSize: 12, lineHeight: 15 },
  labelActive: { fontFamily: fontFamilies.extrabold, fontSize: 12, lineHeight: 15 },
  eyebrow: {
    fontFamily: fontFamilies.extrabold,
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: eyebrowTracking,
    textTransform: 'uppercase',
  },
  badge: { fontFamily: fontFamilies.extrabold, fontSize: 9, lineHeight: 11 },
  pill: { fontFamily: fontFamilies.extrabold, fontSize: 11, lineHeight: 14 },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;

export const space = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  section: 26,
  /** Screen side padding */
  gutter: 16,
  /** Gap between header rows */
  headerGap: 14,
  /** Side margin of the floating bottom area */
  floatingMargin: 12,
  floatingGap: 10,
} as const;

export const radii = {
  search: 14,
  card: 18,
  tile: 16,
  nav: 26,
  navItem: 20,
  full: 999,
} as const;

export const sizes = {
  touch: 44,
  headerButton: 48,
  searchHeight: 52,
  chipWidth: 76,
  chipIcon: 24,
  underlineWidth: 44,
  underlineHeight: 4,
  serviceIcon: 34,
  serviceCardMinHeight: 128,
  navIcon: 24,
  deliveryIcon: 40,
  iconStroke: 1.8,
} as const;
