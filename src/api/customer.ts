import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Restaurant } from '@/data/catalog/types';

import { apiRequest, type Envelope } from './client';
import { productKeys } from './products';

/** What every sign-in endpoint returns. */
export type LoginResult = {
  id: string;
  name?: string;
  phoneNumber: string;
  area?: string;
  isNew: boolean;
  token: string;
};

export type ProfileFields = { name?: string; email?: string; area?: string };

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

export const customerKeys = {
  addresses: ['addresses'] as const,
  orders: ['orders'] as const,
  myOrders: ['orders', 'mine'] as const,
  restaurants: ['restaurants'] as const,
  restaurant: (id: string) => ['restaurants', id] as const,
};

// ---- Queries. `enabled: false` is how a screen skips a call (for example while signed out). ----

type QueryOptions = { enabled?: boolean };

export function useAddresses({ enabled = true }: QueryOptions = {}) {
  return useQuery({
    queryKey: customerKeys.addresses,
    queryFn: async ({ signal }) => (await apiRequest<Envelope<AddressDto[]>>('/customers/me/addresses', { signal })).data,
    enabled,
  });
}

export function useMyOrders({ enabled = true, refetchInterval }: QueryOptions & { refetchInterval?: number } = {}) {
  return useQuery({
    queryKey: customerKeys.myOrders,
    queryFn: async ({ signal }) => (await apiRequest<Envelope<OrderDto[]>>('/orders/mine', { signal })).data,
    enabled,
    refetchInterval,
  });
}

export function useRestaurants({ enabled = true }: QueryOptions = {}) {
  return useQuery({
    queryKey: customerKeys.restaurants,
    queryFn: async ({ signal }) => (await apiRequest<Envelope<Restaurant[]>>('/restaurants', { signal })).data,
    enabled,
  });
}

export function useRestaurant(id: string) {
  return useQuery({
    queryKey: customerKeys.restaurant(id),
    queryFn: async ({ signal }) => (await apiRequest<Envelope<Restaurant>>(`/restaurants/${id}`, { signal })).data,
  });
}

// ---- Mutations ----

/** Real sign-in: the Firebase phone-OTP ID token goes here once the native module is set up. */
export function useFirebaseLogin() {
  return useMutation({
    mutationFn: async (body: { idToken: string }) =>
      (await apiRequest<Envelope<LoginResult>>('/customers/auth/firebase', { method: 'POST', body })).data,
  });
}

/** Development only: the backend 404s this unless ALLOW_DEV_LOGIN=true outside production. */
export function useDevLogin() {
  return useMutation({
    mutationFn: async (body: { phoneNumber: string; intent: 'signup' | 'signin'; name?: string }) =>
      (await apiRequest<Envelope<LoginResult>>('/customers/auth/dev', { method: 'POST', body })).data,
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: async (body: ProfileFields) => (await apiRequest<Envelope<ProfileFields>>('/customers/me', { method: 'PATCH', body })).data,
  });
}

export function useAddAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: NewAddress) => (await apiRequest<Envelope<AddressDto>>('/customers/me/addresses', { method: 'POST', body })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: customerKeys.addresses }),
  });
}

/** A cart with items from several shops comes back as one order per shop. */
export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: NewOrder) => {
      const res = await apiRequest<OrdersEnvelope>('/orders', { method: 'POST', body });
      return res.orders ?? [res.data];
    },
    // Placing an order changes what is in stock, so the catalogue is stale too.
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: customerKeys.orders }),
        queryClient.invalidateQueries({ queryKey: productKeys.all }),
      ]),
  });
}
