import { Link } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { ScreenScroll } from '@/components/catalog/screen-scroll';
import { AppText } from '@/components/ui/app-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { useUpdateProfile } from '@/api/customer';
import { errorMessage } from '@/api/errors';
import { queryClient } from '@/api/query-client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout, selectCurrentCustomer, updateCustomer } from '@/store/slices/auth-slice';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const customer = useAppSelector(selectCurrentCustomer);
  const update = useUpdateProfile();
  const [name, setName] = useState(customer?.name ?? '');
  const [area, setArea] = useState(customer?.area ?? '');
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  if (!customer) {
    return (
      <ScreenScroll>
        <AppText variant="hero" accessibilityRole="header">
          Profile
        </AppText>
        <Link href="/sign-in?redirect=/profile" asChild>
          <AppText variant="link" color="brand" accessibilityRole="link">
            Sign in to see your profile and orders.
          </AppText>
        </Link>
      </ScreenScroll>
    );
  }

  async function save() {
    setMessage(null);
    try {
      const saved = await update.mutateAsync({ name: name.trim(), area: area.trim() });
      dispatch(updateCustomer({ name: saved.name, area: saved.area }));
      setMessage({ text: 'Saved.', ok: true });
    } catch (e) {
      setMessage({ text: errorMessage(e, 'Could not save your profile.'), ok: false });
    }
  }

  function signOut() {
    // The store's sign-out listener also clears the query cache; do it here too so it is immediate.
    dispatch(logout());
    queryClient.clear();
  }

  return (
    <ScreenScroll>
      <AppText variant="hero" accessibilityRole="header">
        Profile
      </AppText>
      <AppText variant="body" color="textMuted">
        {customer.phoneNumber}
      </AppText>

      <TextField label="Name" value={name} onChangeText={setName} autoCapitalize="words" />
      <TextField label="Delivery area" value={area} onChangeText={setArea} autoCapitalize="words" />
      {message ? (
        <AppText variant="caption" color={message.ok ? 'brand' : 'badge'} accessibilityRole="alert">
          {message.text}
        </AppText>
      ) : null}
      <PrimaryButton label="Save" onPress={save} loading={update.isPending} />

      <View style={{ gap: 12 }}>
        <Link href="/address" asChild>
          <AppText variant="link" color="brand" accessibilityRole="link">
            Saved addresses
          </AppText>
        </Link>
        <Link href="/order-again" asChild>
          <AppText variant="link" color="brand" accessibilityRole="link">
            Your orders
          </AppText>
        </Link>
      </View>

      <PrimaryButton label="Sign out" variant="outline" onPress={signOut} />
    </ScreenScroll>
  );
}
