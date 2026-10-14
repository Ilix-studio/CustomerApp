import { Link } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ScreenScroll } from '@/components/catalog/screen-scroll';
import { AppText } from '@/components/ui/app-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { TextField } from '@/components/ui/text-field';
import { palette, radii, space } from '@/constants/tokens';
import { errorMessage, useAddAddressMutation, useGetAddressesQuery } from '@/store/customer-api';
import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/auth-slice';

const blank = { label: '', line1: '', city: '', state: '', pincode: '' };

export default function AddressScreen() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: addresses, isLoading } = useGetAddressesQuery(undefined, { skip: !isAuthenticated });
  const [addAddress, { isLoading: saving }] = useAddAddressMutation();
  const [form, setForm] = useState(blank);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <ScreenScroll>
        <AppText variant="hero">Addresses</AppText>
        <Link href="/sign-in?redirect=/address" asChild>
          <AppText variant="link" color="brand" accessibilityRole="link">
            Sign in to save an address.
          </AppText>
        </Link>
      </ScreenScroll>
    );
  }

  const set = (key: keyof typeof blank) => (value: string) => setForm((f) => ({ ...f, [key]: value }));
  const complete = Object.values(form).every((v) => v.trim() !== '');

  async function save() {
    setError(null);
    try {
      await addAddress(form).unwrap();
      setForm(blank);
    } catch (e) {
      setError(errorMessage(e, 'Could not save the address.'));
    }
  }

  return (
    <ScreenScroll>
      <AppText variant="hero" accessibilityRole="header">
        Addresses
      </AppText>

      {isLoading ? (
        <ActivityIndicator color={palette.brand} />
      ) : addresses && addresses.length > 0 ? (
        addresses.map((a) => (
          <View key={a.id} style={styles.card}>
            <AppText variant="cardTitle">{a.label}</AppText>
            <AppText variant="body" color="textMuted">
              {a.line1}, {a.city}, {a.state} {a.pincode}
            </AppText>
          </View>
        ))
      ) : (
        <AppText variant="body" color="textMuted">
          No saved addresses yet.
        </AppText>
      )}

      <AppText variant="h2">Add an address</AppText>
      <TextField label="Label (Home, Work)" value={form.label} onChangeText={set('label')} autoCapitalize="words" />
      <TextField label="Address" value={form.line1} onChangeText={set('line1')} autoCapitalize="sentences" />
      <TextField label="City" value={form.city} onChangeText={set('city')} autoCapitalize="words" />
      <TextField label="State" value={form.state} onChangeText={set('state')} autoCapitalize="words" />
      <TextField label="Pincode" value={form.pincode} onChangeText={set('pincode')} keyboardType="number-pad" maxLength={6} />
      {error ? (
        <AppText variant="caption" color="badge" accessibilityRole="alert">
          {error}
        </AppText>
      ) : null}
      <PrimaryButton label="Save address" onPress={save} loading={saving} disabled={!complete} />
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: palette.border,
    padding: space.lg,
    gap: space.xs,
  },
});
