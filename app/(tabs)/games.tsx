// Games Screen (Tab)
import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Button, Card, SectionHeader, Badge } from '@/components';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY, TIME_CONTROLS } from '@/constants/design';

export default function GamesScreen() {
  const router = useRouter();

  const gameModes = [
    { id: 'vs-ai', title: 'Bilgisayara Karşı', desc: 'AI seviyesi ve süre seçerek oyna', icon: '🤖', color: COLORS.gold },
    { id: 'puzzle', title: 'Puzzle', desc: 'Taktik egzersizleri çöz', icon: '🧩', color: COLORS.crystal },
    { id: 'practice', title: 'Pratik', desc: 'Açılış, orta oyun, son oyun çalışmaları', icon: '📚', color: '#a855f7' },
  ];

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Oyun Modları</Text>
          <Text style={styles.subtitle}>Oynamak istediğiniz modu seçin</Text>
        </View>

        <View style={styles.modesGrid}>
          {gameModes.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[styles.modeCard, { borderColor: mode.color }]}
              onPress={() => {
                if (mode.id === 'vs-ai') router.push('/new-game');
                else if (mode.id === 'puzzle') router.push('/puzzle');
                else alert(`${mode.title} yakında eklenecek`);
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.modeIcon, { backgroundColor: mode.color + '20' }]}>
                <Text style={styles.modeIconText}>{mode.icon}</Text>
              </View>
              <Text style={styles.modeTitle}>{mode.title}</Text>
              <Text style={styles.modeDesc}>{mode.desc}</Text>
              <View style={[styles.modeArrow, { borderColor: mode.color }]}>
                <Text style={{ color: mode.color }}>▶</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <SectionHeader title="Süre Kontrolleri" />
        <View style={styles.modesGrid}>
          {TIME_CONTROLS.map((tc) => (
            <TouchableOpacity
              key={tc.id}
              style={styles.tcCard}
              onPress={() => alert(`${tc.label} - Tek başına seçilemez, "Bilgisayara Karşı" modunda seçin`)}
              activeOpacity={0.8}
            >
              <Text style={styles.tcLabel}>{tc.label}</Text>
              <Text style={styles.tcDesc}>{tc.increment > 0 ? `+${tc.increment}s/hamle` : 'İnkreman yok'}</Text>
            </TouchableOpacity>
          ))}
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
  modesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  modeCard: {
    flex: 1,
    minWidth: '45%',
    padding: SPACING.lg,
    backgroundColor: COLORS.bgSurface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    gap: SPACING.md,
  },
  modeIcon: { width: 56, height: 56, borderRadius: BORDER_RADIUS.md, justifyContent: 'center', alignItems: 'center' },
  modeIconText: { fontSize: 28 },
  modeTitle: { ...TYPOGRAPHY.headlineSmall, color: COLORS.textPrimary, textAlign: 'center' },
  modeDesc: { ...TYPOGRAPHY.bodySmall, color: COLORS.textMuted, textAlign: 'center' },
  modeArrow: { marginTop: SPACING.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.sm, borderWidth: 1 },
  tcCard: {
    flex: 1,
    minWidth: '30%',
    padding: SPACING.md,
    backgroundColor: COLORS.bgSurface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  tcLabel: { ...TYPOGRAPHY.labelMedium, color: COLORS.textPrimary, textAlign: 'center' },
  tcDesc: { ...TYPOGRAPHY.bodySmall, color: COLORS.textMuted, textAlign: 'center', marginTop: 2 },
});