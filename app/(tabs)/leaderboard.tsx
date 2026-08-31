// Leaderboard Screen (Tab)
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Screen } from '@/components/Screen';
import { Card, SectionHeader, Badge, Avatar } from '@/components';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '@/constants/design';
import { formatElo } from '@/utils/helpers';

const mockLeaderboard = [
  { rank: 1, username: 'MagnusC', elo: 2847, avatar: undefined, gamesPlayed: 234, winRate: 78.2 },
  { rank: 2, username: 'HikaruN', elo: 2812, avatar: undefined, gamesPlayed: 189, winRate: 75.6 },
  { rank: 3, username: 'FabianoC', elo: 2798, avatar: undefined, gamesPlayed: 156, winRate: 74.1 },
  { rank: 4, username: 'AlirezaF', elo: 2785, avatar: undefined, gamesPlayed: 142, winRate: 73.8 },
  { rank: 5, username: 'AnishG', elo: 2764, avatar: undefined, gamesPlayed: 134, winRate: 72.5 },
  { rank: 6, username: 'WesleyS', elo: 2751, avatar: undefined, gamesPlayed: 128, winRate: 71.9 },
  { rank: 7, username: 'LevonA', elo: 2748, avatar: undefined, gamesPlayed: 119, winRate: 71.2 },
  { rank: 8, username: 'MaximeV', elo: 2739, avatar: undefined, gamesPlayed: 112, winRate: 70.8 },
  { rank: 9, username: 'IanN', elo: 2726, avatar: undefined, gamesPlayed: 108, winRate: 69.4 },
  { rank: 10, username: 'TeimourR', elo: 2718, avatar: undefined, gamesPlayed: 103, winRate: 68.9 },
  // Local player would be inserted here
  { rank: 47, username: 'Oyuncu', elo: 1200, avatar: undefined, gamesPlayed: 12, winRate: 58.3 },
];

export default function LeaderboardScreen() {
  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Liderlik Tablosu</Text>
          <Text style={styles.subtitle}>En iyi oyuncular</Text>
        </View>

        <Card variant="elevated" padding="none">
          {mockLeaderboard.map((player, index) => (
            <View key={player.rank} style={[
              styles.playerRow,
              index === mockLeaderboard.length - 1 && styles.currentPlayer,
            ]}>
              <View style={styles.rankContainer}>
                <Text style={[
                  styles.rank,
                  player.rank <= 3 && styles.rankTop,
                ]}>
                  #{player.rank}
                </Text>
                {player.rank === 1 && <Text style={styles.crown}>👑</Text>}
                {player.rank === 2 && <Text style={styles.medal}>🥈</Text>}
                {player.rank === 3 && <Text style={styles.medal}>🥉</Text>}
              </View>
              <View style={styles.playerInfo}>
                <Avatar name={player.username} size="sm" />
                <View style={styles.playerDetails}>
                  <Text style={styles.playerName}>{player.username}</Text>
                  <Text style={styles.playerStats}>
                    {player.gamesPlayed} oyun • %{player.winRate.toFixed(1)} kazanma
                  </Text>
                </View>
              </View>
              <View style={styles.playerElo}>
                <Text style={[styles.eloValue, { color: player.elo >= 2700 ? COLORS.gold : COLORS.textPrimary }]}>
                  {formatElo(player.elo)}
                </Text>
                {player.elo >= 2700 && <Badge variant="gold" size="sm">GM</Badge>}
              </View>
            </View>
          ))}
        </Card>

        <SectionHeader title="Ligler" />
        <View style={styles.leaguesGrid}>
          <Card variant="gold" padding="md" style={styles.leagueCard}>
            <Text style={styles.leagueIcon}>💎</Text>
            <Text style={styles.leagueTitle}>Großmeister</Text>
            <Text style={styles.leagueDesc}>2500+ ELO</Text>
            <Badge variant="gold" size="sm">12 oyuncu</Badge>
          </Card>
          <Card variant="default" padding="md" style={styles.leagueCard}>
            <Text style={styles.leagueIcon}>🏆</Text>
            <Text style={styles.leagueTitle}>Usta</Text>
            <Text style={styles.leagueDesc}>2200-2499 ELO</Text>
            <Badge variant="crystal" size="sm">45 oyuncu</Badge>
          </Card>
          <Card variant="default" padding="md" style={styles.leagueCard}>
            <Text style={styles.leagueIcon}>⭐</Text>
            <Text style={styles.leagueTitle}>Uzman</Text>
            <Text style={styles.leagueDesc}>2000-2199 ELO</Text>
            <Badge variant="success" size="sm">128 oyuncu</Badge>
          </Card>
          <Card variant="default" padding="md" style={styles.leagueCard}>
            <Text style={styles.leagueIcon}>🎖️</Text>
            <Text style={styles.leagueTitle}>Kulüp</Text>
            <Text style={styles.leagueDesc}>1600-1999 ELO</Text>
            <Badge variant="warning" size="sm">567 oyuncu</Badge>
          </Card>
          <Card variant="default" padding="md" style={styles.leagueCard}>
            <Text style={styles.leagueIcon}>📈</Text>
            <Text style={styles.leagueTitle}>Hobi</Text>
            <Text style={styles.leagueDesc}>1200-1599 ELO</Text>
            <Badge variant="default" size="sm">1.2K oyuncu</Badge>
          </Card>
          <Card variant="default" padding="md" style={styles.leagueCard}>
            <Text style={styles.leagueIcon}>🌱</Text>
            <Text style={styles.leagueTitle}>Başlangıç</Text>
            <Text style={styles.leagueDesc}>1200 altı ELO</Text>
            <Badge variant="default" size="sm">3.4K oyuncu</Badge>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { padding: SPACING.md, paddingBottom: 100, gap: SPACING.lg },
  header: { alignItems: 'center', paddingTop: SPACING.md, gap: 4 },
  title: { ...TYPOGRAPHY.displayMedium, color: COLORS.textPrimary },
  subtitle: { ...TYPOGRAPHY.bodyMedium, color: COLORS.textMuted },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  currentPlayer: { backgroundColor: COLORS.goldDim },
  rankContainer: { width: 50, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4 },
  rank: { ...TYPOGRAPHY.monoMedium, color: COLORS.textSecondary, width: 30 },
  rankTop: { color: COLORS.gold, fontWeight: '700' },
  crown: { fontSize: 16 },
  medal: { fontSize: 14 },
  playerInfo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flex: 1 },
  playerDetails: { gap: 2 },
  playerName: { ...TYPOGRAPHY.bodyMedium, color: COLORS.textPrimary },
  playerStats: { ...TYPOGRAPHY.bodySmall, color: COLORS.textMuted },
  playerElo: { alignItems: 'flex-end', gap: 4 },
  eloValue: { ...TYPOGRAPHY.monoMedium },
  leaguesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  leagueCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    gap: SPACING.xs,
    padding: SPACING.md,
  },
  leagueIcon: { fontSize: 28 },
  leagueTitle: { ...TYPOGRAPHY.labelMedium, color: COLORS.textPrimary, textAlign: 'center' },
  leagueDesc: { ...TYPOGRAPHY.bodySmall, color: COLORS.textMuted, textAlign: 'center' },
});