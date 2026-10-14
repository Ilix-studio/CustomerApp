import type { Restaurant } from '@/data/catalog/types';

import { apiSlice } from './api-slice';
import type { Envelope } from './base-query';

/** What every sign-in endpoint returns. */
export type LoginResult = {
  id: string;
  name?: string;
  phoneNumber: string;
  area?: string;
  isNew: boolean;
  token: string;
};

export type AddressDto = { id: string; label: string; line1: string; city: string; state: string; pincode: string };
export type NewAddress = Omit<AddressDto, 'id'>;

export type PaymentMethod = 'gpay' | 'phonepe';

export type OrderStatus = 'placed' | 'accepted' | 'packing' | 'ready' | 'out_for_delivery' | 'delivered' | 'rejected';

export type OrderDto = {
  id: string;
  number: number;
  merchant?: { id: string; name: string };
  items: { productId: string; variantId?: string; name: string; price: number; quantity: number }[];
  paymentMethod: PaymentMethod;
  total: number;
  status: OrderStatus;
  createdAt: string;
};

export type NewOrder = {
  addressId: string;
  paymentMethod: PaymentMethod;
  items: { productId: string; variantId?: string; quantity: number }[];
};

type OrdersEnvelope = Envelope<OrderDto> & { orders?: OrderDto[] };

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /** Real sign-in: the Firebase phone-OTP ID token goes here once the native module is set up. */
    firebaseLogin: builder.mutation<LoginResult, { idToken: string }>({
      query: (body) => ({ url: '/customers/auth/firebase', method: 'POST', body }),
      transformResponse: (res: Envelope<LoginResult>) => res.data,
    }),
    /** Development only: the backend 404s this unless ALLOW_DEV_LOGIN=true outside production. */
    devLogin: builder.mutation<LoginResult, { phoneNumber: string; intent: 'signup' | 'signin'; name?: string }>({
      query: (body) => ({ url: '/customers/auth/dev', method: 'POST', body }),
      transformResponse: (res: Envelope<LoginResult>) => res.data,
    }),
    updateProfile: builder.mutation<{ name?: string; email?: string; area?: string }, { name?: string; email?: string; area?: string }>({
      query: (body) => ({ url: '/customers/me', method: 'PATCH', body }),
      transformResponse: (res: Envelope<{ name?: string; email?: string; area?: string }>) => res.data,
      invalidatesTags: ['Customer'],
    }),
    getAddresses: builder.query<AddressDto[], void>({
      query: () => '/customers/me/addresses',
      transformResponse: (res: Envelope<AddressDto[]>) => res.data,
      providesTags: ['Address'],
    }),
    addAddress: builder.mutation<AddressDto, NewAddress>({
      query: (body) => ({ url: '/customers/me/addresses', method: 'POST', body }),
      transformResponse: (res: Envelope<AddressDto>) => res.data,
      invalidatesTags: ['Address'],
    }),
    /** A cart with items from several shops comes back as one order per shop. */
    createOrder: builder.mutation<OrderDto[], NewOrder>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      transformResponse: (res: OrdersEnvelope) => res.orders ?? [res.data],
      // Placing an order changes what is in stock, so the catalogue is stale too.
      invalidatesTags: ['Order', 'Product'],
    }),
    getMyOrders: builder.query<OrderDto[], void>({
      query: () => '/orders/mine',
      transformResponse: (res: Envelope<OrderDto[]>) => res.data,
      providesTags: ['Order'],
    }),
    getRestaurants: builder.query<Restaurant[], void>({
      query: () => '/restaurants',
      transformResponse: (res: Envelope<Restaurant[]>) => res.data,
      providesTags: ['Restaurant'],
    }),
    getRestaurant: builder.query<Restaurant, string>({
      query: (id) => `/restaurants/${id}`,
      transformResponse: (res: Envelope<Restaurant>) => res.data,
      providesTags: ['Restaurant'],
    }),
  }),
});

export const {
  useFirebaseLoginMutation,
  useDevLoginMutation,
  useUpdateProfileMutation,
  useGetAddressesQuery,
  useAddAddressMutation,
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetRestaurantsQuery,
  useGetRestaurantQuery,
} = customerApi;

/** The server's message for a failed RTK Query call, or a fallback. */
export function errorMessage(error: unknown, fallback = 'Something went wrong. Try again.'): string {
  const e = error as { data?: { message?: string }; status?: unknown } | undefined;
  if (e?.data?.message) return e.data.message;
  if (e?.status === 'FETCH_ERROR') return 'Cannot reach the server. Check your connection.';
  return fallback;
}
