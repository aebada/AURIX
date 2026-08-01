import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useThemeColors } from '@/components/useThemeColors';
import { savingsGoal } from '@/lib/mock-data';
import { marketApi, ApiError, type MarketPrices } from '@/lib/api';

interface PriceRow {
  symbol: string;
  label: string;
  price: string;
}

function toRows(prices: MarketPrices): PriceRow[] {
  return [
    { symbol: 'XAU', label: 'Gold / gram', price: `$${prices.goldUsdPerGram.toFixed(2)}` },
    { symbol: 'XAG', label: 'Silver / gram', price: `$${prices.silverUsdPerGram.toFixed(2)}` },
    { symbol: 'BTC', label: 'Bitcoin', price: `$${prices.btcUsd.toLocaleString()}` },
    { symbol: 'EURUSD', label: 'EUR / USD', price: prices.eurUsd.toFixed(4) },
  ];
}

export default function MarketScreen() {
  const colors = useThemeColors();
  const [rows, setRows] = useState<PriceRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const goalPct = Math.round((savingsGoal.currentGrams / savingsGoal.targetGrams) * 100);

  async function load() {
    try {
      const res = await marketApi.prices();
      setRows(toRows(res.prices));
      setError(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load market prices');
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.symbol}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <View>
            {error && (
              <Text style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{error}</Text>
            )}
            <Text style={styles.sectionTitle}>Live prices</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.priceRow,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}>
            <View style={{ backgroundColor: 'transparent' }}>
              <Text style={styles.priceLabel}>{item.label}</Text>
              <Text style={[styles.priceSymbol, { color: colors.muted }]}>
                {item.symbol}
              </Text>
            </View>
            <Text style={styles.priceValue}>{item.price}</Text>
          </View>
        )}
        ListFooterComponent={
          <View
            style={[
              styles.goalCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}>
            <Text style={styles.sectionTitle}>{savingsGoal.name}</Text>
            <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${goalPct}%`, backgroundColor: colors.tint },
                ]}
              />
            </View>
            <Text style={[styles.goalDetail, { color: colors.muted }]}>
              {savingsGoal.currentGrams}g of {savingsGoal.targetGrams}g goal ({goalPct}%) — illustrative, savings goals aren&apos;t wired to the backend yet
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 20, gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  priceLabel: { fontSize: 14, fontWeight: '600' },
  priceSymbol: { fontSize: 12, marginTop: 2 },
  priceValue: { fontSize: 15, fontWeight: '700' },
  goalCard: { borderWidth: 1, borderRadius: 20, padding: 20, marginTop: 16 },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: { height: '100%', borderRadius: 999 },
  goalDetail: { fontSize: 12, marginTop: 10 },
});
