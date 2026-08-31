// Stats Screen
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useUserStore } from '@/store/userStore';
import { Screen } from '@/components/Screen';
import { Card, SectionHeader, Divider, Badge } from '@/components';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY, AI_LEVELS } from '@/constants/design';
import { formatElo, formatTimeLong } from '@/utils/helpers';

export default function StatsScreen() {
  const { profile } = useUserStore();
  const { stats, elo, achievements } = profile;
const { ratingHistory } = stats;

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Overview */}
        <SectionHeader title="Genel Bakış" />
        <View style={styles.statsGrid}>
          <Card variant="gold" padding="lg" style={styles.statCard}>
            <Text style={styles.statLabel}>Toplam Oyun</Text>
            <Text style={styles.statValueBig}>{stats.total}</Text>
          </Card>
          <Card variant="default" padding="lg" style={styles.statCard}>
            <Text style={styles.statLabel}>Mevcut ELO</Text>
            <Text style={[styles.statValueBig, { color: COLORS.gold }]}>{formatElo(elo)}</Text>
          </Card>
          <Card variant="default" padding="lg" style={styles.statCard}>
            <Text style={styles.statLabel}>En Yüksek ELO</Text>
            <Text style={[styles.statValueBig, { color: COLORS.gold }]}>
              {ratingHistory.length > 0 ? formatElo(Math.max(...ratingHistory.map(r => r.elo))) : formatElo(elo)}
            </Text>
          </Card>
        </View>

        {/* Win/Loss/Draw */}
        <Divider />
        <SectionHeader title="Sonuçlar" />
        <View style={styles.statsGrid}>
          <Card variant="default" padding="lg" style={[styles.statCard, { borderLeftColor: COLORS.win, borderLeftWidth: 4 }]}>
            <Text style={styles.statLabel}>Galibiyet</Text>
            <Text style={[styles.statValueBig, { color: COLORS.win }]}>{stats.wins}</Text>
            <Text style={styles.statSub}>{stats.total > 0 ? ((stats.wins / stats.total) * 100).toFixed(1) : 0}%</Text>
          </Card>
          <Card variant="default" padding="lg" style={[styles.statCard, { borderLeftColor: COLORS.draw, borderLeftWidth: 4 }]}>
            <Text style={styles.statLabel}>Berabere</Text>
            <Text style={[styles.statValueBig, { color: COLORS.draw }]}>{stats.draws}</Text>
            <Text style={styles.statSub}>{stats.total > 0 ? ((stats.draws / stats.total) * 100).toFixed(1) : 0}%</Text>
          </Card>
          <Card variant="default" padding="lg" style={[styles.statCard, { borderLeftColor: COLORS.loss, borderLeftWidth: 4 }]}>
            <Text style={styles.statLabel}>Mağlubiyet</Text>
            <Text style={[styles.statValueBig, { color: COLORS.loss }]}>{stats.losses}</Text>
            <Text style={styles.statSub}>{stats.total > 0 ? ((stats.losses / stats.total) * 100).toFixed(1) : 0}%</Text>
          </Card>
        </View>

        {/* Performance Metrics */}
        <Divider />
        <SectionHeader title="Performans" />
        <View style={styles.statsGrid}>
          <Card variant="default" padding="md" style={styles.statCard}>
            <Text style={styles.statLabel}>Kazanma Oranı</Text>
            <Text style={[styles.statValue, { color: COLORS.gold }]}>{stats.winRate.toFixed(1)}%</Text>
          </Card>
          <Card variant="default" padding="md" style={styles.statCard}>
            <Text style={styles.statLabel}>Mevcut Seri</Text>
            <Text style={[styles.statValue, { color: stats.currentStreak > 0 ? COLORS.win : COLORS.loss }]}>
              {stats.currentStreak > 0 ? '+' : ''}{stats.currentStreak}
            </Text>
          </Card>
          <Card variant="default" padding="md" style={styles.statCard}>
            <Text style={styles.statLabel}>En Uzun Galibiyet Serisi</Text>
            <Text style={styles.statValue}>{stats.longestWinStreak}</Text>
          </Card>
          <Card variant="default" padding="md" style={styles.statCard}>
            <Text style={styles.statLabel}>En Uzun Mağlubiyet Serisi</Text>
            <Text style={[styles.statValue, { color: COLORS.loss }]}>{stats.longestLossStreak}</Text>
          </Card>
          <Card variant="default" padding="md" style={styles.statCard}>
            <Text style={styles.statLabel}>Ortalama Oyun Süresi</Text>
            <Text style={styles.statValue}>{formatTimeLong(stats.avgGameDuration)}</Text>
          </Card>
          <Card variant="default" padding="md" style={styles.statCard}>
            <Text style={styles.statLabel}>Toplam Oynama Süresi</Text>
            <Text style={styles.statValue}>{formatTimeLong(stats.totalPlayTime)}</Text>
          </Card>
        </View>

        {/* Time Control Stats */}
        <Divider />
        <SectionHeader title="Süre Kontrollerine Göre" />
        <Card variant="elevated" padding="md">
          {Object.entries(stats.gamesByTimeControl).map(([tc, data]) => (
            <View key={tc} style={styles.tcRow}>
              <Text style={styles.tcName}>{tc}</Text>
              <View style={styles.tcStats}>
                <Text style={styles.tcPlayed}>{data.played} oynandı</Text>
                <Text style={[styles.tcWon, { color: data.played > 0 ? COLORS.win : COLORS.textMuted }]}>
                  {data.played > 0 ? `${((data.won / data.played) * 100).toFixed(1)}%` : '0%'}
                </Text>
              </View>
            </View>
          ))}
        </Card>

        {/* AI Level Stats */}
        <Divider />
        <SectionHeader title="AI Seviyelerine Göre" />
        <Card variant="elevated" padding="md">
          {AI_LEVELS.map((level) => {
            const data = stats.gamesVsAI[level.id];
            return (
              <View key={level.id} style={styles.aiRow}>
                <View style={styles.aiInfo}>
                  <Badge variant="gold" size="sm">{level.name}</Badge>
                  <Text style={styles.aiElo}>~{level.elo} ELO</Text>
                </View>
                <View style={styles.aiStats}>
                  <Text style={styles.aiPlayed}>{data.played} oynandı</Text>
                  <Text style={[styles.aiWon, { color: data.played > 0 ? COLORS.win : COLORS.textMuted }]}>
                    {data.played > 0 ? `${((data.won / data.played) * 100).toFixed(1)}%` : '0%'}
                  </Text>
                </View>
              </View>
            );
          })}
        </Card>

        {/* Rating History */}
        {ratingHistory.length > 0 && (
          <>
            <Divider />
            <SectionHeader title="ELO Geçmişi" />
            <Card variant="elevated" padding="md">
              <View style={styles.ratingChart}>
                {ratingHistory.slice(-20).map((point, index) => (
                  <View key={index} style={styles.ratingPoint}>
                    <Text style={styles.ratingDate}>
                      {new Date(point.date).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}
                    </Text>
                    <Text style={[styles.ratingValue, { color: index > 0 && point.elo > ratingHistory[index - 1].elo ? COLORS.win : COLORS.gold }]}>
                      {formatElo(point.elo)}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { padding: SPACING.md, paddingBottom: 100, gap: SPACING.lg },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  statCard: { flex: 1, minWidth: '30%', alignItems: 'center', gap: 4 },
  statLabel: { ...TYPOGRAPHY.labelSmall, color: COLORS.textMuted, textTransform: 'uppercase', textAlign: 'center' },
  statValue: { ...TYPOGRAPHY.headlineMedium, color: COLORS.textPrimary },
  statValueBig: { ...TYPOGRAPHY.displayMedium, color: COLORS.textPrimary },
  statSub: { ...TYPOGRAPHY.bodySmall, color: COLORS.textMuted },
  tcRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.borderSubtle },
  tcName: { ...TYPOGRAPHY.bodyMedium, color: COLORS.textPrimary },
  tcStats: { flexDirection: 'row', gap: SPACING.md, alignItems: 'center' },
  tcPlayed: { ...TYPOGRAPHY.bodySmall, color: COLORS.textMuted },
  tcWon: { ...TYPOGRAPHY.bodyMedium, fontWeight: '600' },
  aiRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.borderSubtle },
  aiInfo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  aiElo: { ...TYPOGRAPHY.bodySmall, color: COLORS.textMuted },
  aiStats: { flexDirection: 'row', gap: SPACING.md, alignItems: 'center' },
  aiPlayed: { ...TYPOGRAPHY.bodySmall, color: COLORS.textMuted },
  aiWon: { ...TYPOGRAPHY.bodyMedium, fontWeight: '600' },
  ratingChart: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md, justifyContent: 'space-between' },
  ratingPoint: { alignItems: 'center', gap: 2, minWidth: 50 },
  ratingDate: { ...TYPOGRAPHY.labelSmall, color: COLORS.textMuted },
  ratingValue: { ...TYPOGRAPHY.bodyMedium, fontWeight: '600' },
});