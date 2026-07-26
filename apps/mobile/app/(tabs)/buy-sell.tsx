import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useThemeColors } from '@/components/useThemeColors';
import { marketPrices, wallet } from '@/lib/mock-data';

type Side = 'buy' | 'sell';
type AssetChoice = 'GOLD' | 'SILVER';

export default function BuySellScreen() {
  const colors = useThemeColors();
  const [side, setSide] = useState<Side>('buy');
  const [asset, setAsset] = useState<AssetChoice>('GOLD');
  const [amount, setAmount] = useState('');

  const price = marketPrices.find((p) => p.symbol === (asset === 'GOLD' ? 'XAU' : 'XAG'));
  const fiatBalance = wallet.find((w) => w.asset === 'FIAT');

  const amountNumber = Number(amount) || 0;
  const fee = amountNumber * 0.005;
  const total = amountNumber + fee;

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
          Amount ({side === 'buy' ? 'fiat to spend' : 'units to sell'})
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
          <Text style={styles.rowValue}>{price?.price} / gram</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: colors.muted }]}>Fee (~0.5%)</Text>
          <Text style={styles.rowValue}>${fee.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: colors.muted }]}>
            {side === 'buy' ? 'Total to pay' : 'You receive'}
          </Text>
          <Text style={styles.rowValueStrong}>${total.toFixed(2)}</Text>
        </View>

        <Text style={[styles.helper, { color: colors.muted }]}>
          Fiat balance available: {fiatBalance?.displayValue}
        </Text>
      </View>

      <Pressable style={[styles.cta, { backgroundColor: colors.tint }]}>
        <Text style={[styles.ctaLabel, { color: colors.background }]}>
          {side === 'buy' ? 'Review buy' : 'Review sell'}
        </Text>
      </Pressable>

      <Text style={[styles.disclaimer, { color: colors.muted }]}>
        This screen is mock UI only — no order is routed to a vault partner
        yet. See services/backend POST /payments/buy and /sell.
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
