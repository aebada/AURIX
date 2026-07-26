import { Pressable, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { Text, View } from '@/components/Themed';
import { useThemeColors } from '@/components/useThemeColors';

const actions = [
  { key: 'send', label: 'Send', ios: 'arrow.up.circle.fill', android: 'arrow_upward' },
  { key: 'request', label: 'Request', ios: 'arrow.down.circle.fill', android: 'arrow_downward' },
  { key: 'qr', label: 'Scan QR', ios: 'qrcode.viewfinder', android: 'qr_code_scanner' },
  { key: 'nfc', label: 'Tap to Pay', ios: 'wave.3.right.circle.fill', android: 'nfc' },
] as const;

export default function PaymentsScreen() {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.qrCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}>
        <View style={[styles.qrPlaceholder, { borderColor: colors.tint }]}>
          <SymbolView
            name={{ ios: 'qrcode', android: 'qr_code', web: 'qr_code' }}
            tintColor={colors.tint}
            size={96}
          />
        </View>
        <Text style={[styles.qrHint, { color: colors.muted }]}>
          Your AURIX pay code — share it to receive instantly
        </Text>
      </View>

      <View style={styles.actionsGrid}>
        {actions.map((action) => (
          <Pressable
            key={action.key}
            style={[
              styles.actionTile,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}>
            <SymbolView
              name={{ ios: action.ios, android: action.android, web: action.android }}
              tintColor={colors.tint}
              size={28}
            />
            <Text style={styles.actionLabel}>{action.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.disclaimer, { color: colors.muted }]}>
        NFC / QR / P2P payment flows are mock UI only in this scaffold — see
        services/backend POST /wallet/transfer for the underlying API.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 20 },
  qrCard: {
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  qrPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrHint: { fontSize: 13, textAlign: 'center' },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: 'transparent',
  },
  actionTile: {
    width: '47%',
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  actionLabel: { fontSize: 14, fontWeight: '700' },
  disclaimer: { fontSize: 11, textAlign: 'center', lineHeight: 16, marginTop: 'auto' },
});
