import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useThemeColors } from '@/components/useThemeColors';
import { useAuth } from '@/lib/auth-context';
import {
  walletApi,
  marketApi,
  ApiError,
  type Asset,
  type WalletBalance,
  type Transaction,
  type MarketPrices,
} from '@/lib/api';

const ASSET_LABEL: Record<Asset, string> = { GOLD: 'Gold', SILVER: 'Silver', FIAT: 'Fiat' };

function formatBalance(asset: Asset, balance: number) {
  if (asset === 'FIAT') return `$${balance.toFixed(2)}`;
  return `${balance.toFixed(4)} g`;
}

function formatAmount(t: Transaction) {
  const sign = t.type === 'buy' || t.type === 'deposit' ? '+' : '-';
  const value = t.asset === 'FIAT' ? `$${t.amount.toFixed(2)}` : `${t.amount.toFixed(4)} g`;
  return `${sign}${value}`;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function WalletScreen() {
  const colors = useThemeColors();
  const { token } = useAuth();
  const [balances, setBalances] = useState<WalletBalance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [prices, setPrices] = useState<MarketPrices | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const [w, t, m] = await Promise.all([
        walletApi.balances(token),
        walletApi.transactions(token),
        marketApi.prices(),
      ]);
      setBalances(w.balances);
      setTransactions(
        [...t.transactions].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      );
      setPrices(m.prices);
      setError(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load account data');
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  const fiat = balances.find((b) => b.asset === 'FIAT')?.balance ?? 0;
  const gold = balances.find((b) => b.asset === 'GOLD')?.balance ?? 0;
  const silver = balances.find((b) => b.asset === 'SILVER')?.balance ?? 0;
  const goldUsd = prices ? gold * prices.goldUsdPerGram : 0;
  const silverUsd = prices ? silver * prices.silverUsdPerGram : 0;
  const totalUsd = fiat + goldUsd + silverUsd;

  const displayBalances: { asset: Asset; balance: number }[] = [
    { asset: 'GOLD', balance: gold },
    { asset: 'SILVER', balance: silver },
    { asset: 'FIAT', balance: fiat },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <View>
            {error && (
              <Text style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{error}</Text>
            )}
            <View
              style={[
                styles.balanceCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}>
              <Text style={[styles.balanceLabel, { color: colors.muted }]}>
                Total balance
              </Text>
              <Text style={styles.balanceValue}>${totalUsd.toFixed(2)}</Text>
            </View>

            <View style={styles.assetsRow}>
              {displayBalances.map((item) => (
                <View
                  key={item.asset}
                  style={[
                    styles.assetPill,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}>
                  <Text style={[styles.assetLabel, { color: colors.muted }]}>
                    {ASSET_LABEL[item.asset]}
                  </Text>
                  <Text style={styles.assetValue}>{formatBalance(item.asset, item.balance)}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Recent activity</Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={{ color: colors.muted, fontSize: 13, textAlign: 'center', padding: 20 }}>
            No transactions yet.
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.txnRow,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}>
            <View style={{ backgroundColor: 'transparent' }}>
              <Text style={styles.txnLabel}>{capitalize(item.type)}</Text>
              <Text style={[styles.txnDate, { color: colors.muted }]}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.txnAmount}>{formatAmount(item)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    gap: 10,
  },
  balanceCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  balanceValue: {
    fontSize: 34,
    fontWeight: '800',
    marginTop: 6,
  },
  assetsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  assetPill: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
  },
  assetLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
  },
  assetValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  txnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  txnLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  txnDate: {
    fontSize: 12,
    marginTop: 2,
  },
  txnAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
});
