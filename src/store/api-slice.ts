import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithAuthGuard } from './base-query';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuthGuard,
  tagTypes: ['Product', 'Customer', 'Address', 'Order', 'Restaurant'],
  endpoints: () => ({}),
});
