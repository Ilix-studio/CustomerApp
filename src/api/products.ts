import { useQuery } from '@tanstack/react-query';

import type { CatalogProduct } from '@/data/catalog/types';

import { apiRequest } from './client';

/** Wire shape from GET /products: a superset of the client's product type. */
export type ProductDto = CatalogProduct & {
  category: string;
  totalStock: number;
  isSoldOut: boolean;
  isLowStock: boolean;
  isAvailable: boolean;
  /**
   * False until stock is connected (warehouse or merchant). While false the
   * catalogue lists every item and shows no stock status; once true it lists
   * only available items and shows the status. Decided by the server.
   */
  showStock: boolean;
};

type ProductsEnvelope = {
  success: boolean;
  count: number;
  meta?: { mode: 'preview' | 'live'; showStock: boolean };
  data: Omit<ProductDto, 'showStock'>[];
};

export type ProductFilter = { category?: string; subCategory?: string };

export const productKeys = {
  all: ['products'] as const,
  list: (filter: ProductFilter = {}) => ['products', filter] as const,
};

async function fetchProducts(filter: ProductFilter, signal?: AbortSignal): Promise<ProductDto[]> {
  const res = await apiRequest<ProductsEnvelope>('/products', { params: filter, signal });
  return res.data.map((p) => ({ ...p, showStock: res.meta?.showStock ?? false }));
}

export function useProducts(filter: ProductFilter = {}) {
  return useQuery({ queryKey: productKeys.list(filter), queryFn: ({ signal }) => fetchProducts(filter, signal) });
}
