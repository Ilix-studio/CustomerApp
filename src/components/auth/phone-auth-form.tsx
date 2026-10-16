import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { ScreenScroll } from '@/components/catalog/screen-scroll';
import { AppText } from '@/components/ui/app-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { isDevLoginEnabled, otpErrorMessage, phoneOtpAvailable, sendOtp, type OtpChallenge } from '@/lib/phone-auth';
import { useDevLogin, useFirebaseLogin, useUpdateProfile } from '@/api/customer';
import { errorMessage } from '@/api/errors';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/auth-slice';

/** Only in-app paths may be redirected to, so a crafted link can't send a signed-in user elsewhere. */
const safeRedirect = (value: string | undefined) => (value && value.startsWith('/') && !value.startsWith('//') ? value : '/');

/**
 * One form for both screens. With a text-message code, signing in and signing up are the same step (the
 * server creates the account the first time a number is verified); sign-up also asks for a name.
 */
export function PhoneAuthForm({ mode }: { mode: 'signup' | 'signin' }) {
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const dispatch = useAppDispatch();
  const firebaseLogin = useFirebaseLogin();
  const updateProfile = useUpdateProfile();
  const devLogin = useDevLogin();
  const devLoading = devLogin.isPending;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [challenge, setChallenge] = useState<OtpChallenge | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signingUp = mode === 'signup';
  const phoneValid = /^\+?\d{10,15}$/.test(phone.trim());
  const detailsValid = phoneValid && (!signingUp || name.trim() !== '');
  const otherHref = { pathname: signingUp ? '/sign-in' : '/sign-up', params: redirect ? { redirect } : {} } as const;

  async function requestCode() {
    setError(null);
    setBusy(true);
    try {
      setChallenge(await sendOtp(phone.trim()));
      setCode('');
    } catch (e) {
      setError(otpErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode() {
    if (!challenge) return;
    setError(null);
    setBusy(true);
    try {
      const idToken = await challenge.confirm(code);
      const res = await firebaseLogin.mutateAsync({ idToken });
      dispatch(
        setCredentials({
          token: res.token,
          customer: { id: res.id, name: res.name, phoneNumber: res.phoneNumber, area: res.area },
        }),
      );
      // A new account has no name yet. Failing to save it must not undo a sign-in that worked.
      if (signingUp && name.trim() && !res.name) {
        await updateProfile.mutateAsync({ name: name.trim() }).catch(() => undefined);
      }
      router.replace(safeRedirect(redirect) as never);
    } catch (e) {
      // The server rejects with an ApiError, Firebase with an Error that has an `auth/...` code.
      const fromFirebase = typeof e === 'object' && e !== null && 'code' in e && String((e as { code: unknown }).code).startsWith('auth/');
      setError(fromFirebase ? otpErrorMessage(e) : errorMessage(e, 'Could not sign in. Try again.'));
    } finally {
      setBusy(false);
    }
  }

  async function submitDev() {
    setError(null);
    try {
      const res = await devLogin.mutateAsync({ phoneNumber: phone.trim(), intent: mode, name: signingUp ? name.trim() : undefined });
      dispatch(
        setCredentials({
          token: res.token,
          customer: { id: res.id, name: res.name, phoneNumber: res.phoneNumber, area: res.area },
        }),
      );
      router.replace(safeRedirect(redirect) as never);
    } catch (e) {
      setError(errorMessage(e, signingUp ? 'Could not sign up. Try again.' : 'Could not sign in. Try again.'));
    }
  }

  return (
    <ScreenScroll insetTop>
      <Stack.Screen options={{ title: signingUp ? 'Sign up' : 'Sign in' }} />
      <AppText variant="hero" accessibilityRole="header">
        {signingUp ? 'Create your account' : 'Sign in'}
      </AppText>
      <AppText variant="body" color="textMuted">
        {challenge
          ? `Enter the 6-digit code we texted to ${phone.trim()}.`
          : signingUp
            ? 'Sign up with your phone number to order and track deliveries.'
            : 'Use your phone number to order and track deliveries.'}
      </AppText>

      {challenge ? (
        <TextField label="Text message code" value={code} onChangeText={setCode} keyboardType="number-pad" autoComplete="sms-otp" maxLength={6} />
      ) : (
        <>
          {signingUp ? <TextField label="Your name" value={name} onChangeText={setName} autoCapitalize="words" autoComplete="name" /> : null}
          <TextField
            label="Phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoComplete="tel"
            placeholder="+91 98765 43210"
          />
        </>
      )}

      {error ? (
        <AppText variant="caption" color="badge" accessibilityRole="alert">
          {error}
        </AppText>
      ) : null}

      {phoneOtpAvailable ? (
        challenge ? (
          <>
            <PrimaryButton label="Verify and continue" onPress={verifyCode} loading={busy} disabled={code.trim().length !== 6} />
            <PrimaryButton
              label="Use a different number"
              variant="outline"
              onPress={() => {
                setChallenge(null);
                setError(null);
              }}
              disabled={busy}
            />
          </>
        ) : (
          <>
            <PrimaryButton label="Send code" onPress={requestCode} loading={busy} disabled={!detailsValid} />
            <AppText variant="caption" color="textMuted">
              We will text you a code. Message and data rates may apply.
            </AppText>
          </>
        )
      ) : (
        <AppText variant="body" color="textMuted">
          Phone sign-in isn&apos;t set up for this build yet. Add the Firebase web settings to .env.
        </AppText>
      )}

      {isDevLoginEnabled && !challenge ? (
        <>
          <PrimaryButton
            label={signingUp ? 'Sign up (development)' : 'Continue (development sign-in)'}
            onPress={submitDev}
            variant="outline"
            loading={devLoading}
            disabled={!detailsValid}
          />
          <AppText variant="caption" color="textMuted">
            Development build: this skips the text-message code. It only works against a local backend with
            ALLOW_DEV_LOGIN=true.
          </AppText>
        </>
      ) : null}

      <Link href={otherHref as never} replace>
        <AppText variant="body" color="brand">
          {signingUp ? 'Already have an account? Sign in' : 'New here? Create an account'}
        </AppText>
      </Link>
    </ScreenScroll>
  );
}
