import { createContext, use, useState, type ReactNode } from 'react';

import { placeholderSession } from '@/config/app-config';

export type SavedAddress = { label: string; line: string };

type AppState = {
  address: SavedAddress;
  walletBalance: number;
  /** In-memory only, so dismissal lasts for the current session. */
  deliveryBarDismissed: boolean;
  dismissDeliveryBar: () => void;
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [address] = useState<SavedAddress>(placeholderSession.address);
  const [walletBalance] = useState<number>(placeholderSession.walletBalance);
  const [deliveryBarDismissed, setDeliveryBarDismissed] = useState(false);

  return (
    <AppStateContext
      value={{
        address,
        walletBalance,
        deliveryBarDismissed,
        dismissDeliveryBar: () => setDeliveryBarDismissed(true),
      }}>
      {children}
    </AppStateContext>
  );
}

export function useAppState() {
  const state = use(AppStateContext);
  if (!state) throw new Error('useAppState must be used inside <AppStateProvider>');
  return state;
}
