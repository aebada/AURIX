import { Pressable, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { Text, View } from '@/components/Themed';
import { useThemeColors } from '@/components/useThemeColors';
import { profile } from '@/lib/mock-data';

const menuItems = [
  { key: 'kyc', label: 'Identity verification', ios: 'checkmark.seal.fill', android: 'verified' },
  { key: 'security', label: 'Security & devices', ios: 'lock.fill', android: 'lock' },
  { key: 'limits', label: 'Limits', ios: 'gauge', android: 'speed' },
  { key: 'support', label: 'Support', ios: 'questionmark.circle.fill', android: 'help' },
] as const;

export default function ProfileScreen() {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.tint }]}>
          <Text style={[styles.avatarInitial, { color: colors.background }]}>
            {profile.fullName.charAt(0)}
          </Text>
        </View>
        <Text style={styles.name}>{profile.fullName}</Text>
        <Text style={[styles.email, { color: colors.muted }]}>{profile.email}</Text>
        <View style={[styles.badge, { borderColor: colors.tint }]}>
          <Text style={[styles.badgeLabel, { color: colors.tint }]}>
            KYC {profile.kycStatus}
          </Text>
        </View>
      </View>

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
      </View>

      <Text style={[styles.disclaimer, { color: colors.muted }]}>
        Profile data shown here is mock — see services/backend GET /users/me
        and POST /kyc/submit.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 24 },
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
