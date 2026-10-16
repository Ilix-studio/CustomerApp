/** Helpers shared by the native (`phone-auth.ts`) and web (`phone-auth.web.ts`) OTP modules. */

/**
 * Phone-only sign-in against a local backend started with ALLOW_DEV_LOGIN=true. Compiled out of release
 * builds (`__DEV__` is false there), and the backend refuses it in production regardless.
 */
export const isDevLoginEnabled = __DEV__ && process.env.EXPO_PUBLIC_DEV_LOGIN !== 'false';

export type OtpChallenge = {
  /** Checks the code and resolves with a Firebase ID token. */
  confirm: (code: string) => Promise<string>;
};

/** A bare 10-digit number is taken as Indian; anything with a country code is kept as typed. */
export function toE164(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (input.trim().startsWith('+')) return `+${digits}`;
  return digits.length === 10 ? `+91${digits}` : `+${digits}`;
}

/** Turns a Firebase error into something safe to show. */
export function otpErrorMessage(e: unknown): string {
  const code = typeof e === 'object' && e !== null && 'code' in e ? String((e as { code: unknown }).code) : '';
  switch (code) {
    case 'auth/invalid-phone-number':
      return 'That phone number does not look right.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a while and try again.';
    case 'auth/invalid-verification-code':
      return 'That code is not right. Check the text message and try again.';
    case 'auth/code-expired':
    case 'auth/session-expired':
      return 'That code has expired. Ask for a new one.';
    case 'auth/quota-exceeded':
      return 'Text messages are unavailable right now. Try again later.';
    case 'auth/network-request-failed':
      return 'No connection. Check your internet and try again.';
    case 'auth/operation-not-allowed':
      return 'Text-message sign-in is not enabled for this region yet.';
    default:
      return e instanceof Error && e.message ? e.message : 'Something went wrong. Try again.';
  }
}
