/**
 * Phone OTP: Firebase texts a code, the person types it, and we hand the resulting Firebase ID token to
 * the backend (`useFirebaseLoginMutation`), which verifies it. The token is the only thing the backend trusts.
 *
 * Native uses `@react-native-firebase/auth`, which runs in a development build, not Expo Go, and reads the
 * per-platform config files named in `app.json`. The web build uses the Firebase JS SDK (`phone-auth.web.ts`).
 */
import { toE164, type OtpChallenge } from './phone-auth-shared';

export { isDevLoginEnabled, otpErrorMessage, toE164, type OtpChallenge } from './phone-auth-shared';

export const phoneOtpAvailable = true;

export async function sendOtp(phone: string): Promise<OtpChallenge> {
  // Loaded lazily so a build without the native module (Expo Go) can still open the app.
  let auth: typeof import('@react-native-firebase/auth');
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    auth = require('@react-native-firebase/auth');
  } catch {
    throw new Error('Phone sign-in needs the development build of this app. It does not run in Expo Go.');
  }
  const confirmation = await auth.signInWithPhoneNumber(auth.getAuth(), toE164(phone));
  return {
    async confirm(code) {
      const credential = await confirmation.confirm(code.trim());
      // Android can finish sign-in on its own (auto-retrieval) and confirm() then resolves null.
      const user = credential?.user ?? auth.getAuth().currentUser;
      if (!user) throw new Error('Could not complete sign-in. Try again.');
      return user.getIdToken();
    },
  };
}
