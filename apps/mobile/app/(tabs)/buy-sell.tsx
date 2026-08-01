import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useThemeColors } from '@/components/useThemeColors';
import { useAuth } from '@/lib/auth-context';
import { marketApi, paymentsApi, walletApi, ApiError, type MarketPrices, type WalletBalance } from '@/lib/api';

type Side = 'buy' | 'sell';
type AssetChoice = 'GOLD' | 'SILVER';

export default function BuySellScreen() {
  const colors = useThemeColors();
  const { token } = useAuth();
  const [side, setSide] = useState<Side>('buy');
  const [asset, setAsset] = useState<AssetChoice>('GOLD');
  const [amount, setAmount] = useState('');
  const [prices, setPrices] = useState<MarketPrices | null>(null);
  const [balances, setBalances] = useState<WalletBalance[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    marketApi.prices().then((r) => setPrices(r.prices)).catch(() => {});
    walletApi.balances(token).then((r) => setBalances(r.balances)).catch(() => {});
  }, [token]);

  const pricePerUnit = prices
    ? asset === 'GOLD'
      ? prices.goldUsdPerGram
      : prices.silverUsdPerGram
    : null;
  const fiatBalance = balances.find((b) => b.asset === 'FIAT')?.balance ?? 0;
  const assetBalance = balances.find((b) => b.asset === asset)?.balance ?? 0;

  const amountNumber = Number(amount) || 0;
  const fee = amountNumber * 0.005;
  const total = amountNumber + fee;

  async function handleSubmit() {
    if (!token || !pricePerUnit || amountNumber <= 0) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (side === 'buy') {
        await paymentsApi.buy(token, asset, amountNumber, pricePerUnit);
        setNotice(`Bought ${asset.toLowerCase()} with $${amountNumber.toFixed(2)}.`);
      } else {
        await paymentsApi.sell(token, asset, amountNumber, pricePerUnit);
        setNotice(`Sold ${amountNumber} g of ${asset.toLowerCase()}.`);
      }
      setAmount('');
      const [w] = await Promise.all([walletApi.balances(token)]);
      setBalances(w.balances);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : `${side === 'buy' ? 'Buy' : 'Sell'} failed`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.segment, { borderColor: colors.border }]}>
        {(['buy', 'sell'] as Side[]).map((s) => (
          <Pressable
            key={s}
            onPress={() => setSide(s)}
            style={[
              styles.segmentButton,
              side === s && { backgroundColor: colors.tint },
            ]}>
            <Text
              style={[
                styles.segmentLabel,
                side === s && { color: colors.background, fontWeight: '700' },
              ]}>
              {s === 'buy' ? 'Buy' : 'Sell'}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.assetRow}>
        {(['GOLD', 'SILVER'] as AssetChoice[]).map((a) => (
          <Pressable
            key={a}
            onPress={() => setAsset(a)}
            style={[
              styles.assetChip,
              { borderColor: colors.border },
              asset === a && { borderColor: colors.tint, borderWidth: 2 },
            ]}>
            <Text style={styles.assetChipLabel}>{a === 'GOLD' ? 'Gold' : 'Silver'}</Text>
          </Pressable>
        ))}
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}>
        <Text style={[styles.label, { color: colors.muted }]}>
          Amount ({side === 'buy' ? 'fiat to spend' : 'grams to sell'})
        </Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={colors.muted}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        />

        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: colors.muted }]}>Live price</Text>
          <Text style={styles.rowValue}>
            {pricePerUnit ? `$${pricePerUnit.toFixed(2)} / gram` : '…'}
          </Text>
        </View>
        {side === 'buy' && (
          <>
            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: colors.muted }]}>Fee (~0.5%)</Text>
              <Text style={styles.rowValue}>${fee.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.rowLabel, { color: colors.muted }]}>Total to pay</Text>
              <Text style={styles.rowValueStrong}>${total.toFixed(2)}</Text>
            </View>
          </>
        )}

        <Text style={[styles.helper, { color: colors.muted }]}>
          {side === 'buy'
            ? `Fiat balance available: $${fiatBalance.toFixed(2)}`
            : `${asset === 'GOLD' ? 'Gold' : 'Silver'} balance available: ${assetBalance.toFixed(4)} g`}
        </Text>
      </View>

      {error && (
        <Text style={{ color: '#ef4444', fontSize: 13, textAlign: 'center' }}>{error}</Text>
      )}
      {notice && (
        <Text style={{ color: '#22c55e', fontSize: 13, textAlign: 'center' }}>{notice}</Text>
      )}

      <Pressable
        onPress={handleSubmit}
        disabled={busy || !pricePerUnit || amountNumber <= 0}
        style={[styles.cta, { backgroundColor: colors.tint, opacity: busy ? 0.6 : 1 }]}>
        {busy ? (
          <ActivityIndicator color={colors.background} />
        ) : (
          <Text style={[styles.ctaLabel, { color: colors.background }]}>
            {side === 'buy' ? 'Buy' : 'Sell'}
          </Text>
        )}
      </Pressable>

      <Text style={[styles.disclaimer, { color: colors.muted }]}>
        Prices are simulated for this demo — see services/backend GET
        /market-data/prices and POST /payments/buy, /sell.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16 },
  segment: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 999,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
  },
  segmentLabel: { fontSize: 14, fontWeight: '600' },
  assetRow: { flexDirection: 'row', gap: 10, backgroundColor: 'transparent' },
  assetChip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  assetChipLabel: { fontSize: 14, fontWeight: '600' },
  card: { borderWidth: 1, borderRadius: 20, padding: 20, gap: 4 },
  label: { fontSize: 12, textTransform: 'uppercase', marginBottom: 8 },
  input: {
    fontSize: 24,
    fontWeight: '700',
    borderBottomWidth: 1,
    paddingVertical: 8,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    backgroundColor: 'transparent',
  },
  rowLabel: { fontSize: 13 },
  rowValue: { fontSize: 13, fontWeight: '600' },
  rowValueStrong: { fontSize: 15, fontWeight: '800' },
  helper: { fontSize: 12, marginTop: 12 },
  cta: {
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaLabel: { fontSize: 15, fontWeight: '800' },
  disclaimer: { fontSize: 11, textAlign: 'center', lineHeight: 16 },
});
