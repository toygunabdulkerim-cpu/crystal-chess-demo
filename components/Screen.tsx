// Screen Container with SafeArea + themed background
import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/design';

interface ScreenProps {
  children: React.ReactNode;
  style?: any;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export const Screen = ({ children, style, edges }: ScreenProps) => {
  return (
    <SafeAreaView
      style={[styles.screen, style]}
      edges={edges || ['top', 'bottom']}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bgDeep,
  },
});