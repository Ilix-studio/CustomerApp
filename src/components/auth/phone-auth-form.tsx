import { Link, router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { ScreenScroll } from '@/components/catalog/screen-scroll';
import { AppText } from '@/components/ui/app-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { isDevLoginEnabled, phoneOtpAvailable } from '@/lib/phone-auth';
import { errorMessage, useDevLoginMutation } from '@/store/customer-api';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/auth-slice';

/** Only in-app paths may be redirected to, so a crafted link can't send a signed-in user elsewhere. */
const safeRedirect = (value: string | undefined) => (value && value.startsWith('/') && !value.startsWith('//') ? value : '/');

/** One form for both screens: sign-up also asks for a name and refuses a number that already has an account. */
export function PhoneAuthForm({ mode }: { mode: 'signup' | 'signin' }) {
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const dispatch = useAppDispatch();
  const [devLogin, { isLoading }] = useDevLoginMutation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const signingUp = mode === 'signup';
  const valid = /^\+?\d{10,15}$/.test(phone.trim()) && (!signingUp || name.trim() !== '');
  const otherHref = { pathname: signingUp ? '/sign-in' : '/sign-up', params: redirect ? { redirect } : {} } as const;

  async function submit() {
    setError(null);
    try {
      const res = await devLogin({
        phoneNumber: phone.trim(),
        intent: mode,
        name: signingUp ? name.trim() : undefined,
      }).unwrap();
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
        {signingUp ? 'Sign up with your phone number to order and track deliveries.' : 'Use your phone number to order and track deliveries.'}
      </AppText>

      {signingUp ? <TextField label="Your name" value={name} onChangeText={setName} autoCapitalize="words" autoComplete="name" /> : null}
      <TextField
        label="Phone number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        autoComplete="tel"
        placeholder="+91 98765 43210"
      />

      {error ? (
        <AppText variant="caption" color="badge" accessibilityRole="alert">
          {error}
        </AppText>
      ) : null}

      {isDevLoginEnabled ? (
        <>
          <PrimaryButton
            label={signingUp ? 'Sign up (development)' : 'Continue (development sign-in)'}
            onPress={submit}
            loading={isLoading}
            disabled={!valid}
          />
          <AppText variant="caption" color="textMuted">
            Development build: this skips the text-message code. It only works against a local backend with
            ALLOW_DEV_LOGIN=true.
          </AppText>
        </>
      ) : phoneOtpAvailable ? null : (
        <AppText variant="body" color="textMuted">
          Phone sign-in isn&apos;t available in this build yet.
        </AppText>
      )}

      <Link href={otherHref as never} replace>
        <AppText variant="body" color="brand">
          {signingUp ? 'Already have an account? Sign in' : 'New here? Create an account'}
        </AppText>
      </Link>
    </ScreenScroll>
  );
}
