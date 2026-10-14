/**
 * Real customer sign-in is Firebase phone OTP: the app asks Firebase to text a code, Firebase returns an
 * ID token, and the token goes to `useFirebaseLoginMutation` (POST /customers/auth/firebase).
 *
 * That needs `@react-native-firebase/auth`, which only runs in a development build (not Expo Go) and
 * needs the Firebase config files for each platform. It is not set up yet, so until it is, sign-in is
 * available only through the development login below.
 */
export const phoneOtpAvailable = false;

/**
 * Phone-only sign-in against a local backend started with ALLOW_DEV_LOGIN=true. Compiled out of release
 * builds (`__DEV__` is false there), and the backend refuses it in production regardless.
 */
export const isDevLoginEnabled = __DEV__ && process.env.EXPO_PUBLIC_DEV_LOGIN !== 'false';
