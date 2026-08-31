// New Game Screen
import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { useGameStore } from '@/store/gameStore';
import { Screen } from '@/components/Screen';
import { Button, Card, Badge, SectionHeader, Divider } from '@/components';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY, AI_LEVELS, TIME_CONTROLS } from '@/constants/design';
import { formatTime, formatElo } from '@/utils/helpers';

export default function NewGameScreen() {
  const router = useRouter();
  const { profile } = useUserStore();
  const { newGame } = useGameStore();

  const [aiLevel, setAiLevel] = useState(2); // Medium
  const [timeControl, setTimeControl] = useState(2); // 5 min

  const selectedAI = AI_LEVELS[aiLevel];
  const selectedTC = TIME_CONTROLS[timeControl];

  const handleStart = () => {
    const white = {
      id: profile.id,
      name: profile.username,
      elo: profile.elo,
      isHuman: true,
      avatar: undefined,
    };
    const black = {
      id: `ai_${selectedAI.id}`,
      name: `Crystal AI (${selectedAI.name})`,
      elo: selectedAI.elo,
      isHuman: false,
      aiLevel: selectedAI.id as any,
    };

    newGame(white, black, selectedTC, selectedAI.id as any);
    router.push('/game');
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Yeni Oyun</Text>
          <Text style={styles.subtitle}>Bilgisayara karşı oyna</Text>
        </View>

        {/* AI Difficulty */}
        <SectionHeader title="Zorluk Seviyesi" />
        <Card variant="elevated" padding="md">
          <View style={styles.aiLevelGrid}>
            {AI_LEVELS.map((level, index) => (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.aiLevelCard,
                  aiLevel === index && styles.aiLevelSelected,
                ]}
                onPress={() => setAiLevel(index)}
                activeOpacity={0.8}
              >
                <Badge
                  variant={level.color === '#d4a843' ? 'gold' : 'default'}
                  size="sm"
                  style={styles.aiLevelBadge}
                >
                  {index + 1}
                </Badge>
                <Text style={[
                  styles.aiLevelName,
                  aiLevel === index && { color: COLORS.gold },
                ]}>
                  {level.name}
                </Text>
                <Text style={[
                  styles.aiLevelElo,
                  aiLevel === index && { color: COLORS.goldDim },
                ]}>
                  ~{level.elo} ELO
                </Text>
                <View style={[
                  styles.aiLevelBar,
                  aiLevel === index && { backgroundColor: COLORS.gold },
                ]}>
                  <View
                    style={{
                      ...styles.aiLevelFill,
                      width: `${((index + 1) / AI_LEVELS.length) * 100}%`,
                      backgroundColor: aiLevel === index ? COLORS.bgDeep : level.color,
                    }}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Time Control */}
        <Divider />
        <SectionHeader title="Süre Kontrolü" />
        <Card variant="elevated" padding="md">
          <View style={styles.tcGrid}>
            {TIME_CONTROLS.map((tc, index) => (
              <TouchableOpacity
                key={tc.id}
                style={[
                  styles.tcCard,
                  timeControl === index && styles.tcSelected,
                ]}
                onPress={() => setTimeControl(index)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.tcLabel,
                  timeControl === index && { color: COLORS.gold },
                ]}>
                  {tc.label}
                </Text>
                <Text style={[
                  styles.tcDesc,
                  timeControl === index && { color: COLORS.goldDim },
                ]}>
                  {tc.increment > 0 ? `+${tc.increment}s/hamle` : 'İnkreman yok'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Game Preview */}
        <Divider />
        <SectionHeader title="Oyun Önizleme" />
        <Card variant="gold" padding="lg" style={styles.previewCard}>
          <View style={styles.previewRow}>
            <View style={styles.previewPlayer}>
              <Text style={styles.previewPlayerLabel}>BEYAZ (Sen)</Text>
              <Text style={styles.previewPlayerName}>{profile.username}</Text>
              <Text style={styles.previewPlayerElo}>{formatElo(profile.elo)} ELO</Text>
            </View>
            <Text style={styles.previewVs}>VS</Text>
            <View style={styles.previewPlayer}>
              <Text style={styles.previewPlayerLabel}>SİYAH (AI)</Text>
              <Text style={styles.previewPlayerName}>{selectedAI.name}</Text>
              <Text style={styles.previewPlayerElo}>~{selectedAI.elo} ELO</Text>
            </View>
          </View>
          <Divider style={{ marginVertical: SPACING.md, opacity: 0.3 }} />
          <View style={styles.previewDetails}>
            <Text style={styles.previewDetail}><Text style={{ color: COLORS.gold }}>⏱</Text> {selectedTC.label}</Text>
            <Text style={styles.previewDetail}><Text style={{ color: COLORS.gold }}>🧠</Text> Derinlik: {selectedAI.depth}</Text>
          </View>
        </Card>

        {/* Start Button */}
        <Button
          title="Oyunu Başlat"
          onPress={handleStart}
          variant="gold"
          size="lg"
          fullWidth
          leftIcon="▶️"
          style={styles.startButton}
        />
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
  aiLevelGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  aiLevelCard: {
    flex: 1,
    minWidth: '30%',
    padding: SPACING.md,
    backgroundColor: COLORS.bgSurface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  aiLevelSelected: { borderColor: COLORS.gold, backgroundColor: COLORS.goldDim },
  aiLevelBadge: { marginBottom: SPACING.xs },
  aiLevelName: { ...TYPOGRAPHY.labelMedium, color: COLORS.textPrimary },
  aiLevelElo: { ...TYPOGRAPHY.bodySmall, color: COLORS.textMuted },
  aiLevelBar: { width: '100%', height: 4, borderRadius: 2, backgroundColor: COLORS.bgDeep, marginTop: SPACING.xs, overflow: 'hidden' },
  aiLevelFill: { height: '100%', borderRadius: 2 },
  tcGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  tcCard: {
    flex: 1,
    minWidth: '45%',
    padding: SPACING.md,
    backgroundColor: COLORS.bgSurface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  tcSelected: { borderColor: COLORS.gold, backgroundColor: COLORS.goldDim },
  tcLabel: { ...TYPOGRAPHY.labelMedium, color: COLORS.textPrimary },
  tcDesc: { ...TYPOGRAPHY.bodySmall, color: COLORS.textMuted, marginTop: 2 },
  previewCard: { alignItems: 'center' },
  previewRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.lg, flexWrap: 'wrap' },
  previewPlayer: { alignItems: 'center' },
  previewPlayerLabel: { ...TYPOGRAPHY.labelSmall, color: COLORS.textMuted, textTransform: 'uppercase' },
  previewPlayerName: { ...TYPOGRAPHY.headlineMedium, color: COLORS.textPrimary, marginTop: 2 },
  previewPlayerElo: { ...TYPOGRAPHY.bodySmall, color: COLORS.gold },
  previewVs: { ...TYPOGRAPHY.monoLarge, color: COLORS.gold, textShadowColor: COLORS.goldGlow, textShadowRadius: 4 },
  previewDetails: { flexDirection: 'row', gap: SPACING.lg, flexWrap: 'wrap', justifyContent: 'center' },
  previewDetail: { ...TYPOGRAPHY.bodyMedium, color: COLORS.textSecondary },
  startButton: { marginTop: SPACING.md },
});