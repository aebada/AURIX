import { FlatList, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useThemeColors } from '@/components/useThemeColors';
import {
  totalBalanceChangeToday,
  totalBalanceUsd,
  transactions,
  wallet,
} from '@/lib/mock-data';

export default function WalletScreen() {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View
              style={[
                styles.balanceCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}>
              <Text style={[styles.balanceLabel, { color: colors.muted }]}>
                Total balance
              </Text>
              <Text style={styles.balanceValue}>{totalBalanceUsd}</Text>
              <Text style={styles.balanceChange}>
                {totalBalanceChangeToday} today
              </Text>
            </View>

            <View style={styles.assetsRow}>
              {wallet.map((item) => (
                <View
                  key={item.asset}
                  style={[
                    styles.assetPill,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}>
                  <Text style={[styles.assetLabel, { color: colors.muted }]}>
                    {item.label}
                  </Text>
                  <Text style={styles.assetValue}>{item.displayValue}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Recent activity</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.txnRow,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}>
            <View style={{ backgroundColor: 'transparent' }}>
              <Text style={styles.txnLabel}>{item.label}</Text>
              <Text style={[styles.txnDate, { color: colors.muted }]}>
                {item.date}
              </Text>
            </View>
            <Text style={styles.txnAmount}>{item.amount}</Text>
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
  balanceChange: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
    color: '#22c55e',
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
