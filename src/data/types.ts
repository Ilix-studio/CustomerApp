import type { IconName } from '@/components/ui/icon';
import type { ServiceTintKey, TileTintKey } from '@/constants/tokens';

/** Shapes the home feed API is expected to return. */

export type CategoryChip = {
  id: string;
  label: string;
  icon: IconName;
  badge?: string;
};

export type FestiveBannerContent = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  /** Category slug the CTA opens. */
  target: string;
};

export type ServiceCategory = {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
  tint: ServiceTintKey;
};

export type Product = {
  id: string;
  name: string;
  /** Fallback icon shown on the tinted tile when there's no image. */
  icon: IconName;
  /** Remote URL or bundled `require()` asset; transparent PNG preferred. */
  image?: string | number;
};

export type ProductRail = {
  id: string;
  title: string;
  tint: TileTintKey;
  items: Product[];
};

export type HomeFeed = {
  searchHints: string[];
  chips: CategoryChip[];
  banner: FestiveBannerContent | null;
  services: ServiceCategory[];
  rails: ProductRail[];
};
