import { getApps, initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

import { isDevLoginEnabled, otpErrorMessage, toE164, type OtpChallenge } from './phone-auth-shared';

export { isDevLoginEnabled, otpErrorMessage, toE164 };
export type { OtpChallenge };

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

/** The web build needs the Firebase web config in .env; without it the form says so. */
export const phoneOtpAvailable = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let verifier: RecaptchaVerifier | null = null;

export async function sendOtp(phone: string): Promise<OtpChallenge> {
  const auth = getAuth(getApps()[0] ?? initializeApp(firebaseConfig));

  // The invisible reCAPTCHA needs a DOM node; make one rather than ask every screen to host it.
  verifier?.clear();
  const host = document.createElement('div');
  document.body.appendChild(host);
  verifier = new RecaptchaVerifier(auth, host, { size: 'invisible' });

  try {
    const confirmation = await signInWithPhoneNumber(auth, toE164(phone), verifier);
    return {
      async confirm(code) {
        const { user } = await confirmation.confirm(code.trim());
        return user.getIdToken();
      },
    };
  } catch (e) {
    verifier.clear();
    verifier = null;
    throw e;
  }
}
