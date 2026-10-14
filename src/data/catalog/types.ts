import type { IconName } from '@/components/ui/icon';

/** Catalogue shapes ported from localMart-FE `lib/catalog/types.ts`. */

export type SubCategory = {
  /** URL segment, used as a filter on the category screen. */
  slug: string;
  label: string;
  /** Rx items cannot be added to the cart directly. */
  requiresPrescription?: boolean;
};

export type Category = {
  slug: string;
  title: string;
  subtitle: string;
  icon: IconName;
  image: string;
  family: 'product' | 'rx';
  cta: string;
  subCategories: SubCategory[];
  /** Regulatory notice, rendered on strict categories only. */
  notice?: string;
};

export type FestiveKit = {
  slug: string;
  /** Month band shown above the kit name, e.g. "JANUARY". */
  period: string;
  name: string;
  contents: string;
};

/** One sellable size of a product sold by weight or count. */
export type ProductVariant = {
  /** Stable within a product, e.g. "500g", "whole". */
  id: string;
  label: string;
  price: number;
  stockCount: number;
};

export type CatalogProduct = {
  id: string;
  name: string;
  image: string;
  /** Which SubCategory.slug this sits under. */
  subCategory: string;
  /** Sizes, for anything sold by weight. Mutually exclusive with price. */
  variants?: ProductVariant[];
  /** Fixed-pack price. Only when there are no variants. */
  price?: number;
  /** Fixed-pack stock. Only when there are no variants. */
  stockCount?: number;
  pack?: string;
  origin?: string;
  /** What an OTC medicine treats. */
  useFor?: string;
  /** Rx items never go straight to the cart, see `lib/cart.ts`. */
  requiresPrescription?: boolean;
};

export type Restaurant = {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  ratingCount: number;
  prepMinutes: number;
  priceForTwo: number;
  isOpen: boolean;
  signatureDishes: string[];
};
