// _layout.tsx - Root layout with providers
import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Providers } from '@/components/Providers';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Providers>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </Providers>
    </SafeAreaProvider>
  );
}