import type { CatalogProduct } from '@/data/catalog/types';

import { apiSlice } from './api-slice';

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

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductDto[], { category?: string; subCategory?: string } | void>({
      query: (params) => ({ url: '/products', params: params ?? undefined }),
      transformResponse: (res: ProductsEnvelope) =>
        res.data.map((p) => ({ ...p, showStock: res.meta?.showStock ?? false })),
      providesTags: ['Product'],
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
