import { FlatList, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useThemeColors } from '@/components/useThemeColors';
import { marketPrices, savingsGoal } from '@/lib/mock-data';

export default function MarketScreen() {
  const colors = useThemeColors();
  const goalPct = Math.round((savingsGoal.currentGrams / savingsGoal.targetGrams) * 100);

  return (
    <View style={styles.container}>
      <FlatList
        data={marketPrices}
        keyExtractor={(item) => item.symbol}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
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
            <View style={{ backgroundColor: 'transparent', alignItems: 'flex-end' }}>
              <Text style={styles.priceValue}>{item.price}</Text>
              <Text
                style={[
                  styles.priceChange,
                  { color: item.changePct >= 0 ? '#22c55e' : '#ef4444' },
                ]}>
                {item.changePct >= 0 ? '+' : ''}
                {item.changePct}%
              </Text>
            </View>
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
              {savingsGoal.currentGrams}g of {savingsGoal.targetGrams}g goal ({goalPct}%)
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
  priceChange: { fontSize: 12, fontWeight: '600', marginTop: 2 },
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
