import { combineReducers, configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';

import { queryClient } from '@/api/query-client';

import { secureStorage } from './secure-storage';
import authReducer, { logout } from './slices/auth-slice';
import cartReducer from './slices/cart-slice';

// Auth is persisted in secure storage, the cart in AsyncStorage. Server data lives in TanStack Query, never here.
const rootReducer = combineReducers({
  auth: persistReducer({ key: 'auth', version: 1, storage: secureStorage }, authReducer),
  cart: persistReducer({ key: 'cart', version: 1, storage: AsyncStorage }, cartReducer),
});

// Signing out (or an expired token) forgets everything cached for this customer.
const signOutListener = createListenerMiddleware();
signOutListener.startListening({
  actionCreator: logout,
  effect: () => {
    queryClient.clear();
  },
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
    }).prepend(signOutListener.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
