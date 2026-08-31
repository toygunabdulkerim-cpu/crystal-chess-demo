// Profile Screen
import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput } from 'react-native';
import { useUserStore } from '@/store/userStore';
import { Screen } from '@/components/Screen';
import { Card, Button, Badge, Avatar, SectionHeader, Divider } from '@/components';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '@/constants/design';
import { formatElo } from '@/utils/helpers';

export default function ProfileScreen() {
  const { profile, updateUsername, updateProfile, updateSettings } = useUserStore();
  const { username, elo, stats, achievements, settings } = profile;
const { ratingHistory } = stats;
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(username);

  const unlockedCount = achievements.filter(a => a.unlockedAt).length;

  const handleSaveName = () => {
    if (newName.trim() && newName !== username) {
      updateUsername(newName.trim());
    }
    setEditingName(false);
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Card variant="gold" padding="lg" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar name={username} size="xl" border />
            <View style={styles.profileInfo}>
              {editingName ? (
                <View style={styles.editName}>
                  <TextInput
                    style={styles.nameInput}
                    value={newName}
                    onChangeText={setNewName}
                    maxLength={20}
                    autoFocus
                    onSubmitEditing={handleSaveName}
                  />
                </View>
              ) : (
                <Text style={styles.username}>{username}</Text>
              )}
              <View style={styles.eloRow}>
                <Text style={styles.eloLabel}>ELO</Text>
                <Text style={styles.eloValue}>{formatElo(elo)}</Text>
                <Badge variant="gold" size="sm">
                  {elo >= 2000 ? 'Uzman' : elo >= 1600 ? 'Kulüp' : elo >= 1200 ? 'Hobi' : 'Başlangıç'}
                </Badge>
              </View>
              {!editingName && (
                <Button
                  title="Düzenle"
                  onPress={() => setEditingName(true)}
                  variant="outline"
                  size="sm"
                  style={{ marginTop: SPACING.sm }}
                />
              )}
              {editingName && (
                <View style={styles.editButtons}>
                  <Button title="Kaydet" onPress={handleSaveName} variant="gold" size="sm" />
                  <Button title="İptal" onPress={() => { setNewName(username); setEditingName(false); }} variant="outline" size="sm" />
                </View>
              )}
            </View>
          </View>
        </Card>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <Card variant="default" padding="md" style={styles.statCard}>
            <Text style={styles.statLabel}>Oynanan</Text>
            <Text style={styles.statValue}>{stats.total}</Text>
          </Card>
          <Card variant="default" padding="md" style={styles.statCard}>
            <Text style={styles.statLabel}>Galibiyet</Text>
            <Text style={[styles.statValue, { color: COLORS.win }]}>{stats.wins}</Text>
          </Card>
          <Card variant="default" padding="md" style={styles.statCard}>
            <Text style={styles.statLabel}>Berabere</Text>
            <Text style={[styles.statValue, { color: COLORS.draw }]}>{stats.draws}</Text>
          </Card>
          <Card variant="default" padding="md" style={styles.statCard}>
            <Text style={styles.statLabel}>Mağlubiyet</Text>
            <Text style={[styles.statValue, { color: COLORS.loss }]}>{stats.losses}</Text>
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
            <Text style={styles.statLabel}>Başarılar</Text>
            <Text style={styles.statValue}>{unlockedCount}/{achievements.length}</Text>
          </Card>
        </View>

        {/* Achievements */}
        <Divider />
        <SectionHeader title={`Başarılar (${unlockedCount}/${achievements.length})`} />
        <Card variant="elevated" padding="md">
          <View style={styles.achievementsGrid}>
            {achievements.map((a) => (
              <View key={a.id} style={[
                styles.achievementItem,
                a.unlockedAt && styles.achievementUnlocked,
              ]}>
                <View style={[
                  styles.achievementIcon,
                  a.unlockedAt && styles.achievementIconUnlocked,
                ]}>
                  <Text style={{ fontSize: 24 }}>{a.icon}</Text>
                </View>
                <Text style={[
                  styles.achievementName,
                  a.unlockedAt ? {} : { color: COLORS.textMuted },
                ]}>
                  {a.name}
                </Text>
                <Text style={[
                  styles.achievementDesc,
                  a.unlockedAt ? {} : { color: COLORS.textMuted },
                ]}>
                  {a.description}
                </Text>
                {a.unlockedAt && (
                  <Badge variant="success" size="sm">Kazanıldı</Badge>
                )}
              </View>
            ))}
          </View>
        </Card>

        {/* Rating History */}
        {ratingHistory.length > 0 && (
          <>
            <Divider />
            <SectionHeader title="ELO Geçmişi" />
            <Card variant="elevated" padding="md">
              <View style={styles.ratingList}>
                {ratingHistory.slice().reverse().slice(0, 10).map((point, index) => (
                  <View key={index} style={styles.ratingItem}>
                    <Text style={styles.ratingDate}>
                      {new Date(point.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </Text>
                    <View style={styles.ratingValueContainer}>
                      <Text style={[
                        styles.ratingValue,
                        index < ratingHistory.length - 1 && point.elo > ratingHistory[ratingHistory.length - 2 - index].elo
                          ? { color: COLORS.win }
                          : { color: COLORS.gold },
                      ]}>
                        {formatElo(point.elo)}
                      </Text>
                      {index < ratingHistory.length - 1 && (
                        <Text style={styles.ratingChange}>
                          {point.elo - ratingHistory[ratingHistory.length - 2 - index].elo > 0 ? '+' : ''}
                          {point.elo - ratingHistory[ratingHistory.length - 2 - index].elo}
                        </Text>
                      )}
                    </View>
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
  profileCard: { ...SHADOWS.gold },
  profileHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.lg },
  profileInfo: { flex: 1, gap: SPACING.sm },
  username: { ...TYPOGRAPHY.displayMedium, color: COLORS.textPrimary },
  editName: { width: '100%' },
  nameInput: { ...TYPOGRAPHY.displayMedium, color: COLORS.textPrimary, backgroundColor: 'transparent', textAlign: 'left' },
  eloRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flexWrap: 'wrap' },
  eloLabel: { ...TYPOGRAPHY.labelMedium, color: COLORS.textMuted },
  eloValue: { ...TYPOGRAPHY.monoLarge, color: COLORS.gold },
  editButtons: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  statCard: { flex: 1, minWidth: '45%', alignItems: 'center', gap: 2 },
  statLabel: { ...TYPOGRAPHY.labelSmall, color: COLORS.textMuted, textTransform: 'uppercase' },
  statValue: { ...TYPOGRAPHY.headlineLarge, color: COLORS.textPrimary },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  achievementItem: { width: '30%', alignItems: 'center', gap: SPACING.xs, padding: SPACING.sm, backgroundColor: COLORS.bgSurface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  achievementUnlocked: { borderColor: COLORS.gold, backgroundColor: COLORS.goldDim },
  achievementIcon: { width: 56, height: 56, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.bgDeep, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  achievementIconUnlocked: { borderColor: COLORS.gold, backgroundColor: COLORS.goldDim },
  achievementName: { ...TYPOGRAPHY.labelSmall, color: COLORS.textSecondary, textAlign: 'center' },
  achievementDesc: { ...TYPOGRAPHY.bodySmall, color: COLORS.textMuted, textAlign: 'center', marginTop: 2 },
  ratingList: { gap: SPACING.sm },
  ratingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.borderSubtle },
  ratingDate: { ...TYPOGRAPHY.bodySmall, color: COLORS.textMuted, flex: 1 },
  ratingValueContainer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  ratingValue: { ...TYPOGRAPHY.monoMedium },
  ratingChange: { ...TYPOGRAPHY.bodySmall, color: COLORS.win },
});