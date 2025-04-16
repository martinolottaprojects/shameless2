import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[theme].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <Feather name="heart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'DevTools',
          tabBarIcon: ({ color }) => <Feather name="tool" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
