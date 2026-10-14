import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type AuthCustomer = {
  id: string;
  name?: string;
  phoneNumber: string;
  area?: string;
};

export type AuthState = {
  token: string | null;
  customer: AuthCustomer | null;
};

const initialState: AuthState = { token: null, customer: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; customer: AuthCustomer }>) {
      state.token = action.payload.token;
      state.customer = action.payload.customer;
    },
    updateCustomer(state, action: PayloadAction<Partial<AuthCustomer>>) {
      if (state.customer) Object.assign(state.customer, action.payload);
    },
    logout(state) {
      state.token = null;
      state.customer = null;
    },
  },
});

export const { setCredentials, updateCustomer, logout } = authSlice.actions;

/** Narrow state shape so selectors don't import RootState (avoids a cycle). */
type WithAuth = { auth: AuthState };

export const selectToken = (state: WithAuth) => state.auth.token;
export const selectCurrentCustomer = (state: WithAuth) => state.auth.customer;
export const selectIsAuthenticated = (state: WithAuth) => state.auth.token !== null;

export default authSlice.reducer;
