import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';

import { Text, View } from '@/components/Themed';
import { useThemeColors } from '@/components/useThemeColors';
import { useAuth } from '@/lib/auth-context';
import { kycApi, usersApi, ApiError, type AuthUser } from '@/lib/api';

const menuItems = [
  { key: 'security', label: 'Security & devices', ios: 'lock.fill', android: 'lock' },
  { key: 'limits', label: 'Limits', ios: 'gauge', android: 'speed' },
  { key: 'support', label: 'Support', ios: 'questionmark.circle.fill', android: 'help' },
] as const;

export default function ProfileScreen() {
  const colors = useThemeColors();
  const { token, user, setUser, logout } = useAuth();
  const [kycBusy, setKycBusy] = useState(false);
  const [taxId, setTaxId] = useState('');
  const [taxIdBusy, setTaxIdBusy] = useState(false);
  const [taxIdSaved, setTaxIdSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    usersApi.me(token).then((me) => setUser(me)).catch(() => {});
  }, [token, setUser]);

  async function handleKycSubmit() {
    if (!token) return;
    setKycBusy(true);
    setError(null);
    try {
      const res = await kycApi.submit(token);
      setUser({ ...user!, kycStatus: res.kycStatus as AuthUser['kycStatus'] });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to submit KYC');
    } finally {
      setKycBusy(false);
    }
  }

  async function handleSaveTaxId() {
    if (!token || !taxId.trim()) return;
    setTaxIdBusy(true);
    setError(null);
    try {
      const res = await usersApi.setTaxId(token, taxId.trim());
      setUser({ ...user!, taxId: res.taxId });
      setTaxIdSaved(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Couldn't save your tax ID");
    } finally {
      setTaxIdBusy(false);
    }
  }

  async function handleSignOut() {
    await logout();
    router.replace('/login');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
          <Text style={[styles.avatarInitial, { color: colors.background }]}>
            {(user?.fullName ?? user?.email ?? '?').charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{user?.fullName ?? '—'}</Text>
        <Text style={[styles.email, { color: colors.muted }]}>{user?.email ?? ''}</Text>
        <View style={[styles.badge, { borderColor: colors.tint }]}>
          <Text style={[styles.badgeLabel, { color: colors.tint }]}>
            KYC {user?.kycStatus ?? 'unverified'}
          </Text>
        </View>
      </View>

      {error && <Text style={{ color: '#ef4444', fontSize: 13, textAlign: 'center' }}>{error}</Text>}

      {user?.kycStatus === 'unverified' && (
        <Pressable
          onPress={handleKycSubmit}
          disabled={kycBusy}
          style={[styles.kycCta, { backgroundColor: colors.tint, opacity: kycBusy ? 0.6 : 1 }]}>
          {kycBusy ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={[styles.kycCtaLabel, { color: colors.background }]}>
              Start identity verification
            </Text>
          )}
        </Pressable>
      )}

      {!user?.taxId && !taxIdSaved && (
        <View
          style={[
            styles.taxCard,
            { backgroundColor: colors.card, borderColor: colors.tint },
          ]}>
          <Text style={styles.taxTitle}>Add your tax number</Text>
          <Text style={[styles.taxSubtitle, { color: colors.muted }]}>
            Needed before large withdrawals — you can add it now or later.
          </Text>
          <TextInput
            value={taxId}
            onChangeText={setTaxId}
            placeholder="Tax ID / Tax number"
            placeholderTextColor={colors.muted}
            style={[styles.taxInput, { color: colors.text, borderColor: colors.border }]}
          />
          <Pressable
            onPress={handleSaveTaxId}
            disabled={taxIdBusy || !taxId.trim()}
            style={[styles.taxCta, { backgroundColor: colors.tint, opacity: taxIdBusy ? 0.6 : 1 }]}>
            {taxIdBusy ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={[styles.taxCtaLabel, { color: colors.background }]}>Save</Text>
            )}
          </Pressable>
        </View>
      )}

      <View style={styles.menu}>
        {menuItems.map((item) => (
          <Pressable
            key={item.key}
            style={[
              styles.menuRow,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}>
            <SymbolView
              name={{ ios: item.ios, android: item.android, web: item.android }}
              tintColor={colors.tint}
              size={22}
            />
            <Text style={styles.menuLabel}>{item.label}</Text>
          </Pressable>
        ))}

        <Pressable
          onPress={handleSignOut}
          style={[styles.menuRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SymbolView
            name={{ ios: 'arrow.right.square', android: 'logout', web: 'logout' }}
            tintColor="#ef4444"
            size={22}
          />
          <Text style={[styles.menuLabel, { color: '#ef4444' }]}>Sign out</Text>
        </Pressable>
      </View>

      <Text style={[styles.disclaimer, { color: colors.muted }]}>
        Security & devices, Limits, and Support are still mock — see
        services/backend GET /users/me and POST /kyc/submit for what's real.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, gap: 20 },
  header: { alignItems: 'center', gap: 6, backgroundColor: 'transparent' },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { fontSize: 28, fontWeight: '800' },
  name: { fontSize: 18, fontWeight: '700', marginTop: 8 },
  email: { fontSize: 13 },
  badge: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  kycCta: { borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  kycCtaLabel: { fontSize: 14, fontWeight: '800' },
  taxCard: { borderWidth: 1, borderRadius: 20, padding: 20, gap: 10 },
  taxTitle: { fontSize: 15, fontWeight: '700' },
  taxSubtitle: { fontSize: 12, lineHeight: 16 },
  taxInput: {
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  taxCta: { borderRadius: 999, paddingVertical: 12, alignItems: 'center' },
  taxCtaLabel: { fontSize: 14, fontWeight: '800' },
  menu: { gap: 10, backgroundColor: 'transparent' },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  menuLabel: { fontSize: 14, fontWeight: '600' },
  disclaimer: { fontSize: 11, textAlign: 'center', lineHeight: 16, marginTop: 'auto' },
});
