/**
 * App-level config. Values marked PLACEHOLDER stand in for remote config / the user's account
 * until a backend exists — swap these sources, not the components that read them.
 */

export const appConfig = {
  /**
   * Backend base URL (set EXPO_PUBLIC_API_URL). `localhost` only reaches the dev machine from the
   * iOS simulator; use http://10.0.2.2:8080/api on the Android emulator and the machine's LAN IP
   * (http://192.168.x.x:8080/api) on a physical device.
   */
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080/api',
  currencySymbol: '₹',
  locale: 'en-IN',
  /** PLACEHOLDER: free-delivery threshold should come from remote config. */
  freeDeliveryThreshold: 199,
  /** Interval for rotating search placeholder hints. */
  searchHintIntervalMs: 3000,
} as const;

/** PLACEHOLDER: initial session values until auth / account APIs exist. */
export const placeholderSession = {
  address: { label: 'Home', line: 'Ulubari, Guwahati' },
  walletBalance: 0,
} as const;

export function formatCurrency(amount: number) {
  return `${appConfig.currencySymbol}${amount.toLocaleString(appConfig.locale)}`;
}
