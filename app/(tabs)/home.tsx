// Home Screen
import React, { useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { useGameStore } from '@/store/gameStore';
import { Screen } from '@/components/Screen';
import { Button, Card, Badge, Avatar, SectionHeader, Divider } from '@/components';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY, AI_LEVELS } from '@/constants/design';
import { formatElo, formatTimeLong } from '@/utils/helpers';

export default function HomeScreen() {
  const router = useRouter();
  const { profile, addGameResult } = useUserStore();
  const { game } = useGameStore();
  const { stats, settings, elo, username, achievements } = profile;

  const recentGames = game ? [game] : [];
  const unlockedAchievements = achievements.filter(a => a.unlockedAt).length;

  const handleQuickPlay = () => router.push('/new-game');
  const handlePuzzle = () => router.push('/puzzle');
  const handleStats = () => router.push('/stats');
  const handleProfile = () => router.push('/profile');
  const handleSettings = () => router.push('/settings');

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileTopRow}>
            <View style={styles.profileLeft}>
              <Avatar name={username} size="lg" border />
              <View style={styles.profileInfo}>
                <Text style={styles.username}>{username}</Text>
                <View style={styles.eloRow}>
                  <Text style={styles.eloLabel}>ELO</Text>
                  <Text style={styles.eloValue}>{formatElo(elo)}</Text>
                  <Badge variant="gold" size="sm">{elo >= 2000 ? 'Uzman' : elo >= 1600 ? 'Kulüp' : elo >= 1200 ? 'Hobi' : 'Başlangıç'}</Badge>
                </View>
              </View>
            </View>
            <View style={styles.profileActions}>
              <Button title="Yeni Oyun" onPress={handleQuickPlay} variant="gold" size="md" fullWidth leftIcon="♟️" />
              <Button title="Puzzle" onPress={handlePuzzle} variant="outline" size="md" fullWidth leftIcon="🧩" style={{ marginTop: SPACING.sm }} />
            </View>
          </View>
        </View>

        {/* Stats Summary Cards */}
        <View style={styles.statsGrid}>
          <Card variant="gold" padding="md" style={styles.statCard}>
            <Text style={styles.statLabel}>Oynanan</Text>
            <Text style={styles.statValue}>{stats.total}</Text>
          </Card>
          <Card variant="default" padding="md" style={styles.statCard}>
            <Text style={styles.statLabel}>Galibiyet</Text>
            <Text style={[styles.statValue, { color: COLORS.win }]}>{stats.wins}</Text>
          </Card>
          <Card variant="default" padding="md" style={styles.statCard}>
            <Text style={styles.statLabel}>Mağlubiyet</Text>
            <Text style={[styles.statValue, { color: COLORS.loss }]}>{stats.losses}</Text>
          </Card>
          <Card variant="default" padding="md" style={styles.statCard}>
            <Text style={styles.statLabel}>Berabere</Text>
            <Text style={[styles.statValue, { color: COLORS.draw }]}>{stats.draws}</Text>
          </Card>
        </View>

        {/* Win Rate & Streak */}
        <View style={styles.statsGrid}>
          <Card variant="default" padding="md" style={styles.statCard}>
            <Text style={styles.statLabel}>Kazanma %</Text>
            <Text style={[styles.statValue, { color: COLORS.gold }]}>{stats.winRate.toFixed(1)}%</Text>
          </Card>
          <Card variant="default" padding="md" style={styles.statCard}>
            <Text style={styles.statLabel}>Seri</Text>
            <Text style={[styles.statValue, { color: stats.currentStreak > 0 ? COLORS.win : COLORS.loss }]}>
              {stats.currentStreak > 0 ? '+' : ''}{stats.currentStreak}
            </Text>
          </Card>
          <Card variant="default" padding="md" style={styles.statCard}>
            <Text style={styles.statLabel}>En Uzun Seri</Text>
            <Text style={styles.statValue}>{stats.longestWinStreak}</Text>
          </Card>
          <Card variant="default" padding="md" style={styles.statCard}>
            <Text style={styles.statLabel}>Süre</Text>
            <Text style={styles.statValue}>{formatTimeLong(stats.totalPlayTime)}</Text>
          </Card>
        </View>

        {/* Quick Actions */}
        <SectionHeader title="Hızlı Erişim" action={{ label: 'Tümü', onPress: () => {} }} />
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard} onPress={handleQuickPlay} activeOpacity={0.8}>
            <Text style={styles.actionIcon}>♟️</Text>
            <Text style={styles.actionTitle}>Yeni Oyun</Text>
            <Text style={styles.actionDesc}>Bilgisayara karşı oyna</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={handlePuzzle} activeOpacity={0.8}>
            <Text style={styles.actionIcon}>🧩</Text>
            <Text style={styles.actionTitle}>Puzzle</Text>
            <Text style={styles.actionDesc}>Taktik egzersizleri çöz</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={handleStats} activeOpacity={0.8}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionTitle}>İstatistikler</Text>
            <Text style={styles.actionDesc}>Performans detayları</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={handleProfile} activeOpacity={0.8}>
            <Text style={styles.actionIcon}>👤</Text>
            <Text style={styles.actionTitle}>Profil</Text>
            <Text style={styles.actionDesc}>Başarılar ve geçmiş</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Games */}
        {recentGames.length > 0 && (
          <>
            <Divider />
            <SectionHeader title="Son Oynananlar" />
            <Card variant="elevated" padding="none">
              {recentGames.map((g) => (
                <View key={g.id} style={styles.recentGameRow}>
                  <View style={styles.recentGameInfo}>
                    <Text style={styles.recentGameMode}>
                      {g.timeControl.label} • {g.white.name} vs {g.black.name}
                    </Text>
                    <Text style={styles.recentGameTime}>
                      {new Date(g.startTime).toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                  <View style={styles.recentGameResult}>
                    <Badge
                      variant={
                        g.result === 'w' ? 'success' :
                        g.result === 'b' ? 'error' : 'warning'
                      }
                    >
                      {g.result === 'draw' ? '½-½' : g.result === 'w' ? '1-0' : '0-1'}
                    </Badge>
                  </View>
                </View>
              ))}
            </Card>
          </>
        )}

        {/* Achievements Progress */}
        <Divider />
        <SectionHeader title={`Başarılar (${unlockedAchievements}/${achievements.length})`} />
        <Card variant="elevated" padding="md">
          <View style={styles.achievementsGrid}>
            {achievements.slice(0, 6).map((a) => (
              <View key={a.id} style={styles.achievementItem}>
                <View
                  style={[
                    styles.achievementIcon,
                    a.unlockedAt && styles.achievementUnlocked,
                  ]}
                >
                  <Text style={{ fontSize: 20 }}>{a.icon}</Text>
                </View>
                <Text style={[
                  styles.achievementName,
                  a.unlockedAt ? {} : { color: COLORS.textMuted },
                ]}>
                  {a.name}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { padding: SPACING.md, paddingBottom: 100, gap: SPACING.lg },
  profileHeader: { padding: SPACING.md, borderRadius: BORDER_RADIUS.xl, backgroundColor: COLORS.bgElevated, borderWidth: 1, borderColor: COLORS.borderGold, ...SHADOWS.gold },
  profileTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  profileLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  profileInfo: { gap: SPACING.xs },
  username: { ...TYPOGRAPHY.displayMedium, color: COLORS.textPrimary },
  eloRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flexWrap: 'wrap' },
  eloLabel: { ...TYPOGRAPHY.labelMedium, color: COLORS.textMuted },
  eloValue: { ...TYPOGRAPHY.monoLarge, color: COLORS.gold },
  profileActions: { width: 140, gap: SPACING.sm },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  statCard: { flex: 1, minWidth: '45%', alignItems: 'center', gap: 2 },
  statLabel: { ...TYPOGRAPHY.labelSmall, color: COLORS.textMuted, textTransform: 'uppercase' },
  statValue: { ...TYPOGRAPHY.headlineLarge, color: COLORS.textPrimary },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  actionCard: { flex: 1, minWidth: '45%', padding: SPACING.md, backgroundColor: COLORS.bgSurface, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', gap: SPACING.xs },
  actionIcon: { fontSize: 28 },
  actionTitle: { ...TYPOGRAPHY.headlineSmall, color: COLORS.textPrimary, textAlign: 'center' },
  actionDesc: { ...TYPOGRAPHY.bodySmall, color: COLORS.textMuted, textAlign: 'center' },
  recentGameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.borderSubtle },
  recentGameInfo: { flex: 1 },
  recentGameMode: { ...TYPOGRAPHY.bodyMedium, color: COLORS.textPrimary },
  recentGameTime: { ...TYPOGRAPHY.bodySmall, color: COLORS.textMuted, marginTop: 2 },
  recentGameResult: { marginLeft: SPACING.md },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  achievementItem: { width: '30%', alignItems: 'center', gap: SPACING.xs },
  achievementIcon: { width: 50, height: 50, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.bgDeep, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  achievementUnlocked: { borderColor: COLORS.gold, backgroundColor: COLORS.goldDim },
  achievementName: { ...TYPOGRAPHY.labelSmall, color: COLORS.textSecondary, textAlign: 'center' },
});