import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { decrement, increment, lineKey, selectCartLines, selectTotalItems } from '@/store/slices/cart-slice';

/** Cart quantities backed by the persisted `cart` slice. */
export function useCartDraft() {
  const dispatch = useAppDispatch();
  const lines = useAppSelector(selectCartLines);
  const totalItems = useAppSelector(selectTotalItems);

  return {
    lines,
    totalItems,
    quantityOf: (productId: string, variantId?: string) => lines[lineKey(productId, variantId)]?.quantity ?? 0,
    /** Adds one, capped at the stock on hand. */
    increment: (productId: string, max: number, variantId?: string) =>
      dispatch(increment({ productId, max, variantId })),
    /** Removes one; drops the line at zero. */
    decrement: (productId: string, variantId?: string) => dispatch(decrement({ productId, variantId })),
  };
}
