import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
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

import { apiSlice } from './api-slice';
import { secureStorage } from './secure-storage';
import authReducer from './slices/auth-slice';
import cartReducer from './slices/cart-slice';

// Auth is persisted in secure storage, the cart in AsyncStorage. The API cache is never persisted.
const rootReducer = combineReducers({
  auth: persistReducer({ key: 'auth', version: 1, storage: secureStorage }, authReducer),
  cart: persistReducer({ key: 'cart', version: 1, storage: AsyncStorage }, cartReducer),
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
