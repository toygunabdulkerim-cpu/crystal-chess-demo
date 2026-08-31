// Tabs layout with custom tab bar
import React from 'react';
import { Tabs } from 'expo-router';
import { TABS } from '@/constants/design';
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from '@/constants/design';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useColorScheme } from 'react-native';

const TabIcon = ({ name, focused, size = 24 }: { name: string; focused: boolean; size?: number }) => {
  // Simple icon placeholders - would use lucide-react-native or expo-vector-icons in production
  const icons: Record<string, string> = {
    home: '🏠',
    game: '♟️',
    trophy: '🏆',
    shield: '🛡️',
    settings: '⚙️',
  };
  return <Text style={{ fontSize: size, opacity: focused ? 1 : 0.5 }}>{icons[name] || '•'}</Text>;
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.tabInactive,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ focused, size }) => <TabIcon name="home" focused={focused} size={size} />,
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Oyunlar',
          tabBarIcon: ({ focused, size }) => <TabIcon name="game" focused={focused} size={size} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Liderlik',
          tabBarIcon: ({ focused, size }) => <TabIcon name="trophy" focused={focused} size={size} />,
        }}
      />
      <Tabs.Screen
        name="club"
        options={{
          title: 'Kulüp',
          tabBarIcon: ({ focused, size }) => <TabIcon name="shield" focused={focused} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ayarlar',
          tabBarIcon: ({ focused, size }) => <TabIcon name="settings" focused={focused} size={size} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.tabBg,
    borderTopWidth: 1,
    borderTopColor: COLORS.tabBorder,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
    height: 70,
    ...SHADOWS.lg,
  },
});