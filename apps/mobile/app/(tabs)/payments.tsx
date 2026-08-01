import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { Text, View } from '@/components/Themed';
import { useThemeColors } from '@/components/useThemeColors';
import { useAuth } from '@/lib/auth-context';
import { walletApi, ApiError, type Asset } from '@/lib/api';

const actions = [
  { key: 'send', label: 'Send', ios: 'arrow.up.circle.fill', android: 'arrow_upward' },
  { key: 'request', label: 'Request', ios: 'arrow.down.circle.fill', android: 'arrow_downward' },
  { key: 'qr', label: 'Scan QR', ios: 'qrcode.viewfinder', android: 'qr_code_scanner' },
  { key: 'nfc', label: 'Tap to Pay', ios: 'wave.3.right.circle.fill', android: 'nfc' },
] as const;

const ASSETS: Asset[] = ['FIAT', 'GOLD', 'SILVER'];

export default function PaymentsScreen() {
  const colors = useThemeColors();
  const { token } = useAuth();
  const [sendOpen, setSendOpen] = useState(false);
  const [asset, setAsset] = useState<Asset>('FIAT');
  const [toEmail, setToEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSend() {
    if (!token || !toEmail || !amount) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await walletApi.transfer(token, toEmail, asset, Number(amount));
      setNotice(`Sent ${amount} ${asset.toLowerCase()} to ${toEmail}.`);
      setToEmail('');
      setAmount('');
      setSendOpen(false);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Transfer failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
            onPress={() => action.key === 'send' && setSendOpen((v) => !v)}
            style={[
              styles.actionTile,
              { backgroundColor: colors.card, borderColor: colors.border },
              action.key === 'send' && sendOpen && { borderColor: colors.tint, borderWidth: 2 },
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

      {sendOpen && (
        <View
          style={[
            styles.sendCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}>
          <Text style={styles.sendTitle}>Send to another AURIX wallet</Text>

          <View style={styles.assetRow}>
            {ASSETS.map((a) => (
              <Pressable
                key={a}
                onPress={() => setAsset(a)}
                style={[
                  styles.assetChip,
                  { borderColor: colors.border },
                  asset === a && { borderColor: colors.tint, borderWidth: 2 },
                ]}>
                <Text style={styles.assetChipLabel}>{a}</Text>
              </Pressable>
            ))}
          </View>

          <TextInput
            value={toEmail}
            onChangeText={setToEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="recipient@example.com"
            placeholderTextColor={colors.muted}
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          />
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder={asset === 'FIAT' ? 'Amount ($)' : 'Amount (g)'}
            placeholderTextColor={colors.muted}
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          />

          {error && <Text style={{ color: '#ef4444', fontSize: 13 }}>{error}</Text>}

          <Pressable
            onPress={handleSend}
            disabled={busy || !toEmail || !amount}
            style={[styles.sendCta, { backgroundColor: colors.tint, opacity: busy ? 0.6 : 1 }]}>
            {busy ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={[styles.sendCtaLabel, { color: colors.background }]}>Send</Text>
            )}
          </Pressable>
        </View>
      )}

      {notice && (
        <Text style={{ color: '#22c55e', fontSize: 13, textAlign: 'center' }}>{notice}</Text>
      )}

      <Text style={[styles.disclaimer, { color: colors.muted }]}>
        Send is wired to services/backend POST /wallet/transfer. QR / Tap to
        Pay / Request are still mock UI in this scaffold.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, gap: 20 },
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
  sendCard: { borderWidth: 1, borderRadius: 20, padding: 20, gap: 12 },
  sendTitle: { fontSize: 15, fontWeight: '700' },
  assetRow: { flexDirection: 'row', gap: 8, backgroundColor: 'transparent' },
  assetChip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  assetChipLabel: { fontSize: 13, fontWeight: '600' },
  input: {
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  sendCta: { borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  sendCtaLabel: { fontSize: 14, fontWeight: '800' },
  disclaimer: { fontSize: 11, textAlign: 'center', lineHeight: 16, marginTop: 'auto' },
});
