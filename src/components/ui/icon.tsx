import {
  Apple,
  BadgePercent,
  Baby,
  Bean,
  Beef,
  Bike,
  Bird,
  CakeSlice,
  Candy,
  Carrot,
  Cherry,
  ChevronDown,
  Citrus,
  Coffee,
  Cookie,
  Croissant,
  CupSoda,
  Drumstick,
  Egg,
  Fish,
  FishSymbol,
  Flame,
  Flower2,
  Gem,
  Ham,
  HandHeart,
  House,
  IceCreamCone,
  Lamp,
  LayoutGrid,
  Leaf,
  MapPin,
  Mic,
  Pill,
  Popcorn,
  RotateCcw,
  Search,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Sprout,
  Store,
  User,
  Wallet,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react-native';

import { palette, sizes, type PaletteColor } from '@/constants/tokens';

/** Data files reference icons by these names, so feeds stay serialisable. */
const icons = {
  apple: Apple,
  'badge-percent': BadgePercent,
  baby: Baby,
  bean: Bean,
  beef: Beef,
  bike: Bike,
  bird: Bird,
  'cake-slice': CakeSlice,
  candy: Candy,
  carrot: Carrot,
  cherry: Cherry,
  'chevron-down': ChevronDown,
  citrus: Citrus,
  coffee: Coffee,
  cookie: Cookie,
  croissant: Croissant,
  'cup-soda': CupSoda,
  drumstick: Drumstick,
  egg: Egg,
  fish: Fish,
  'fish-symbol': FishSymbol,
  flame: Flame,
  'flower-2': Flower2,
  gem: Gem,
  ham: Ham,
  'hand-heart': HandHeart,
  house: House,
  'ice-cream-cone': IceCreamCone,
  lamp: Lamp,
  'layout-grid': LayoutGrid,
  leaf: Leaf,
  'map-pin': MapPin,
  mic: Mic,
  pill: Pill,
  popcorn: Popcorn,
  'rotate-ccw': RotateCcw,
  search: Search,
  'shopping-cart': ShoppingCart,
  smartphone: Smartphone,
  sparkles: Sparkles,
  sprout: Sprout,
  store: Store,
  user: User,
  wallet: Wallet,
  wrench: Wrench,
  x: X,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

type IconProps = {
  name: IconName;
  size?: number;
  /** A palette token, or a raw color from a tint table in tokens.ts. */
  color?: PaletteColor | (string & {});
  strokeWidth?: number;
};

export function Icon({ name, size = 24, color = 'text', strokeWidth = sizes.iconStroke }: IconProps) {
  const Component = icons[name];
  const resolved = color in palette ? palette[color as PaletteColor] : color;
  return (
    <Component
      size={size}
      color={resolved}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      accessible={false}
    />
  );
}
