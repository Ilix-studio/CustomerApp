export type CartCandidate = {
  productId: string;
  name: string;
  /** Set by the catalogue/server. Rx items never go straight to the cart. */
  requiresPrescription?: boolean;
};

export type CartAction = { kind: 'add' } | { kind: 'prescription'; label: string };

/** The medicine rule, in one place: every add-to-cart surface must go through this. */
export function resolveCartAction(item: CartCandidate): CartAction {
  if (item.requiresPrescription) return { kind: 'prescription', label: 'Upload prescription' };
  return { kind: 'add' };
}

export const canAddToCart = (item: CartCandidate) => resolveCartAction(item).kind === 'add';

/** Filters an Rx item out of any bulk add. */
export const selectCartableItems = <T extends CartCandidate>(items: T[]) => items.filter(canAddToCart);
