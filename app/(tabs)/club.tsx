// Club Screen (Tab)
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Screen } from '@/components/Screen';
import { Card, SectionHeader, Badge, Button, Avatar, Divider } from '@/components';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '@/constants/design';
import { formatElo } from '@/utils/helpers';

const mockClubs = [
  {
    id: '1',
    name: 'İstanbul Şatranç Kulübü',
    description: 'Türkiye\'nin en köklü şatranç kulüplerinden biri. Haftalık turnuvalar ve eğitimler.',
    memberCount: 1247,
    ownerId: 'owner1',
    members: [
      { username: 'HasanE', elo: 2156, role: 'admin' },
      { username: 'AyşeK', elo: 1987, role: 'member' },
      { username: 'MehmetD', elo: 1823, role: 'member' },
    ],
  },
  {
    id: '2',
    name: 'Anadolu Gençlik Kulübü',
    description: 'Genç yetenekleri keşfetme ve geliştirme odaklı kulüp. Online turnuvalar düzenlenir.',
    memberCount: 589,
    ownerId: 'owner2',
    members: [
      { username: 'CanY', elo: 1654, role: 'admin' },
      { username: 'ElifS', elo: 1543, role: 'member' },
    ],
  },
  {
    id: '3',
    name: 'Kristal Atlar',
    description: 'Crystal Chess topluluğunun resmi kulübü. Her seviyeden oyuncu hoş geldin.',
    memberCount: 324,
    ownerId: 'owner3',
    members: [
      { username: 'AliV', elo: 1432, role: 'admin' },
      { username: 'ZeynepT', elo: 1298, role: 'member' },
      { username: 'Oyuncu', elo: 1200, role: 'member' },
    ],
  },
];

export default function ClubScreen() {
  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Kulüpler</Text>
          <Text style={styles.subtitle}>Topluluklara katıl, turnuvalara gir</Text>
        </View>

        {/* My Club */}
        <SectionHeader title="Kulübüm" />
        <Card variant="gold" padding="lg" style={styles.myClubCard}>
          <View style={styles.myClubHeader}>
            <Text style={styles.myClubIcon}>🛡️</Text>
            <View style={styles.myClubInfo}>
              <Text style={styles.myClubName}>Kristal Atlar</Text>
              <Text style={styles.myClubDesc}>Crystal Chess topluluğunun resmi kulübü</Text>
            </View>
            <Badge variant="gold" size="sm">Üye</Badge>
          </View>
          <View style={styles.myClubStats}>
            <View style={styles.myClubStat}>
              <Text style={styles.myClubStatValue}>324</Text>
              <Text style={styles.myClubStatLabel}>Üye</Text>
            </View>
            <View style={styles.myClubStat}>
              <Text style={styles.myClubStatValue}>12</Text>
              <Text style={styles.myClubStatLabel}>Aktif Turnuva</Text>
            </View>
            <View style={styles.myClubStat}>
              <Text style={styles.myClubStatValue}>8</Text>
              <Text style={styles.myClubStatLabel}>Bu Hafta Oyun</Text>
            </View>
          </View>
          <Button title="Kulüp Sayfası" onPress={() => {}} variant="outline" size="md" fullWidth style={{ marginTop: SPACING.md, borderColor: COLORS.gold }} />
        </Card>

        {/* All Clubs */}
        <SectionHeader title="Tüm Kulüpler" />
        <View style={styles.clubsGrid}>
          {mockClubs.map((club) => (
            <Card key={club.id} variant="elevated" padding="md" style={styles.clubCard}>
              <View style={styles.clubHeader}>
                <Text style={styles.clubName}>{club.name}</Text>
                <Badge variant="crystal" size="sm">{club.memberCount} üye</Badge>
              </View>
              <Text style={styles.clubDesc}>{club.description}</Text>
              <View style={styles.clubMembers}>
                {club.members.slice(0, 3).map((member, index) => (
                  <Avatar key={index} name={member.username} size="xs" border={member.role === 'admin'} />
                ))}
                {club.members.length > 3 && (
                  <View style={styles.moreMembers}>
                    <Text style={styles.moreText}>+{club.members.length - 3}</Text>
                  </View>
                )}
              </View>
              <View style={styles.clubActions}>
                <Button title="Katıl" onPress={() => {}} variant={club.members.some(m => m.username === 'Oyuncu') ? 'secondary' : 'outline'} size="sm" fullWidth />
              </View>
            </Card>
          ))}
        </View>

        {/* Create Club */}
        <Divider />
        <SectionHeader title="Kulüp Oluştur" />
        <Card variant="elevated" padding="md">
          <Text style={styles.createDesc}>Kendiniz bir kulüp kurun, arkadaşlarınızı davet edin ve turnuvalar düzenleyin.</Text>
          <Button title="Kulüp Oluştur" onPress={() => alert('Yakında eklenecek')} variant="gold" size="md" fullWidth style={{ marginTop: SPACING.md }} />
        </Card>
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
  myClubCard: { ...SHADOWS.gold },
  myClubHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  myClubIcon: { fontSize: 36 },
  myClubInfo: { flex: 1 },
  myClubName: { ...TYPOGRAPHY.headlineMedium, color: COLORS.textPrimary },
  myClubDesc: { ...TYPOGRAPHY.bodySmall, color: COLORS.textMuted, marginTop: 2 },
  myClubStats: { flexDirection: 'row', justifyContent: 'space-around', marginTop: SPACING.lg, paddingTop: SPACING.lg, borderTopWidth: 1, borderTopColor: COLORS.border },
  myClubStat: { alignItems: 'center' },
  myClubStatValue: { ...TYPOGRAPHY.displaySmall, color: COLORS.gold },
  myClubStatLabel: { ...TYPOGRAPHY.labelSmall, color: COLORS.textMuted, marginTop: 2 },
  clubsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  clubCard: { flex: 1, minWidth: '45%', gap: SPACING.md },
  clubHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  clubName: { ...TYPOGRAPHY.labelMedium, color: COLORS.textPrimary },
  clubDesc: { ...TYPOGRAPHY.bodySmall, color: COLORS.textMuted },
  clubMembers: { flexDirection: 'row', alignItems: 'center', gap: -8, marginTop: SPACING.sm },
  moreMembers: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.bgDeep, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center', marginLeft: -8 },
  moreText: { ...TYPOGRAPHY.labelSmall, color: COLORS.textMuted },
  clubActions: { marginTop: SPACING.sm },
  createDesc: { ...TYPOGRAPHY.bodyMedium, color: COLORS.textMuted, textAlign: 'center' },
});