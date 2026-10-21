import '@/global.css';

import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { queryClient } from '@/api/query-client';
import { palette, typography } from '@/constants/tokens';
import { AppStateProvider } from '@/state/app-state';
import { persistor, store } from '@/store/store';

SplashScreen.preventAutoHideAsync();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.brand,
    background: palette.bg,
    card: palette.surface,
    text: palette.text,
    border: palette.border,
  },
};

export default function RootLayout() {
  // On failure the app still renders; text falls back to the system sans.
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });
  const ready = fontsLoaded || fontError != null;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider value={navigationTheme}>
            <AppStateProvider>
              <Stack
                screenOptions={{
                  headerTintColor: palette.brand,
                  headerTitleStyle: typography.cardTitle,
                  headerBackButtonDisplayMode: 'minimal',
                  contentStyle: { backgroundColor: palette.bg },
                }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="address" options={{ presentation: 'modal', title: 'Address' }} />
                <Stack.Screen name="sign-in" options={{ title: 'Sign in' }} />
                <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />
                <Stack.Screen name="wallet" options={{ title: 'Wallet' }} />
                <Stack.Screen name="profile" options={{ title: 'Profile' }} />
                <Stack.Screen name="search" options={{ title: 'Search' }} />
                <Stack.Screen name="category/[slug]" options={{ title: 'Category' }} />
                <Stack.Screen name="product/[id]" options={{ title: 'Product' }} />
                <Stack.Screen name="restaurant/[id]" options={{ title: 'Restaurant' }} />
                <Stack.Screen name="plan/index" options={{ title: 'Plan' }} />
                <Stack.Screen name="plan/ai-diet-planner" options={{ title: 'AI Diet Planner' }} />
              </Stack>
            </AppStateProvider>
          </ThemeProvider>
        </PersistGate>
      </QueryClientProvider>
    </Provider>
  );
}
