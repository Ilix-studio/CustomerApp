/**
 * App-level config. Values marked PLACEHOLDER stand in for remote config / the user's account
 * until a backend exists — swap these sources, not the components that read them.
 */

export const appConfig = {
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
  cartCount: 0,
} as const;

export function formatCurrency(amount: number) {
  return `${appConfig.currencySymbol}${amount.toLocaleString(appConfig.locale)}`;
}
