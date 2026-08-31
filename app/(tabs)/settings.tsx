// Settings Screen
import React from 'react';
import { ScrollView, View, Text, StyleSheet, Switch } from 'react-native';
import { useSettingsStore } from '@/store/settingsStore';
import { useUserStore } from '@/store/userStore';
import { Screen } from '@/components/Screen';
import { Card, SectionHeader, Divider, Button } from '@/components';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '@/constants/design';

export default function SettingsScreen() {
  const { settings, updateSettings, toggleSetting } = useSettingsStore();
  const { profile, updateProfile } = useUserStore();

  const settingGroups = [
    {
      title: 'Görünüm',
      items: [
        { key: 'pieceSet', label: 'Taş Seti', type: 'select', options: ['crystal', 'classic', 'modern'] },
        { key: 'boardTheme', label: 'Tahta Teması', type: 'select', options: ['classic', 'gold', 'crystal', 'dark', 'wood'] },
        { key: 'showCoordinates', label: 'Koordinatları Göster', type: 'toggle' },
        { key: 'showLegalMoves', label: 'Yasal Hamleleri Göster', type: 'toggle' },
        { key: 'showLastMove', label: 'Son Hamleyi Vurgu La', type: 'toggle' },
      ],
    },
    {
      title: 'Ses ve Titreşim',
      items: [
        { key: 'soundEnabled', label: 'Ses Efektleri', type: 'toggle' },
        { key: 'musicEnabled', label: 'Müzik', type: 'toggle' },
        { key: 'vibration', label: 'Titreşim', type: 'toggle' },
      ],
    },
    {
      title: 'Oyun',
      items: [
        { key: 'moveConfirmation', label: 'Hamle Onayı', type: 'toggle' },
        { key: 'hintsEnabled', label: 'İpuçları', type: 'toggle' },
        { key: 'autoSave', label: 'Otomatik Kaydet', type: 'toggle' },
        { key: 'clockPosition', label: 'Saat Pozisyonu', type: 'select', options: ['top', 'bottom', 'both'] },
      ],
    },
    {
      title: 'Genel',
      items: [
        { key: 'language', label: 'Dil', type: 'select', options: ['tr', 'en'] },
        { key: 'notifications', label: 'Bildirimler', type: 'toggle' },
      ],
    },
  ];

  const optionLabels: Record<string, string> = {
    crystal: 'Kristal', classic: 'Klasik', modern: 'Modern',
    gold: 'Altın', dark: 'Koyu', wood: 'Ahşap',
    top: 'Üst', bottom: 'Alt', both: 'Her İki Taraf',
    tr: 'Türkçe', en: 'English',
  };

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {settingGroups.map((group) => (
          <React.Fragment key={group.title}>
            <SectionHeader title={group.title} />
            <Card variant="elevated" padding="none">
              {group.items.map((item) => (
                <View key={item.key} style={styles.settingRow}>
                  <View style={styles.settingLabel}>
                    <Text style={styles.settingTitle}>{item.label}</Text>
                  </View>
                  {item.type === 'toggle' && (
                    <Switch
                      value={settings[item.key as keyof typeof settings] as boolean}
                      onValueChange={(value) => updateSettings({ [item.key]: value })}
                      trackColor={{ false: COLORS.border, true: COLORS.gold }}
                      thumbColor={settings[item.key as keyof typeof settings] ? COLORS.bgDeep : COLORS.textMuted}
                    />
                  )}
                  {item.type === 'select' && (
                    <View style={styles.selectContainer}>
                      <Text style={styles.selectText}>
                        {optionLabels[settings[item.key as keyof typeof settings] as string] || settings[item.key as keyof typeof settings]}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </Card>
          </React.Fragment>
        ))}

        <Divider />
        <SectionHeader title="Hesap" />
        <Card variant="elevated" padding="md">
          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>Kullanıcı Adı</Text>
            <Text style={styles.accountValue}>{profile.username}</Text>
          </View>
          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>ELO</Text>
            <Text style={[styles.accountValue, { color: COLORS.gold }]}>{profile.elo}</Text>
          </View>
          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>Oynanan Oyun</Text>
            <Text style={styles.accountValue}>{profile.stats.total}</Text>
          </View>
        </Card>

        <Divider />
        <SectionHeader title="Veriler" />
        <Card variant="elevated" padding="md">
          <Button
            title="Oyun Geçmişini Temizle"
            onPress={() => alert('Henüz uygulanmadı')}
            variant="outline"
            size="md"
            fullWidth
            style={{ borderColor: COLORS.loss }}
          />
          <Button
            title="Tüm Verileri Sıfırla"
            onPress={() => alert('Henüz uygulanmadı')}
            variant="outline"
            size="md"
            fullWidth
            style={{ borderColor: COLORS.loss, marginTop: SPACING.sm }}
          />
        </Card>

        <Divider />
        <SectionHeader title="Hakkında" />
        <Card variant="elevated" padding="md">
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Versiyon</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Motor</Text>
            <Text style={styles.aboutValue}>React Native + Expo</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Satranç Motoru</Text>
            <Text style={styles.aboutValue}>chess.js + Custom AI</Text>
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { padding: SPACING.md, paddingBottom: 100, gap: SPACING.lg },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.borderSubtle },
  settingLabel: { flex: 1 },
  settingTitle: { ...TYPOGRAPHY.bodyMedium, color: COLORS.textPrimary },
  selectContainer: { backgroundColor: COLORS.bgSurface, borderRadius: BORDER_RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderWidth: 1, borderColor: COLORS.border },
  selectText: { ...TYPOGRAPHY.bodyMedium, color: COLORS.textSecondary },
  accountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm },
  accountLabel: { ...TYPOGRAPHY.bodyMedium, color: COLORS.textMuted },
  accountValue: { ...TYPOGRAPHY.bodyMedium, color: COLORS.textPrimary, fontWeight: '500' },
  aboutRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm },
  aboutLabel: { ...TYPOGRAPHY.bodyMedium, color: COLORS.textMuted },
  aboutValue: { ...TYPOGRAPHY.bodyMedium, color: COLORS.textSecondary },
});