import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookOpen, Compass, House } from 'lucide-react-native';

import { brand, colors, darkColors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const activeTint = brand.primary;
  const inactiveTint = isDark ? darkColors.text.tertiary : colors.text.quaternary;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        tabBarStyle: {
          backgroundColor: isDark ? darkColors.background.primary : colors.surface.card,
          borderTopWidth: 1,
          borderTopColor: isDark ? darkColors.border.default : colors.border.default,
          height: 64 + insets.bottom,
          paddingTop: 6,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingHorizontal: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontFamily: 'Nunito_700Bold',
          fontSize: 12,
          marginTop: 2,
        },
      }}>

      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 30,
                borderRadius: 15,
                backgroundColor: focused ? brand.primary + '18' : 'transparent',
              }}
            >
              <House
                size={21}
                color={color}
                strokeWidth={focused ? 2.5 : 1.8}
                fill={focused ? brand.primary + '22' : 'transparent'}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 30,
                borderRadius: 15,
                backgroundColor: focused ? brand.primary + '18' : 'transparent',
              }}
            >
              <Compass
                size={21}
                color={color}
                strokeWidth={focused ? 2.5 : 1.8}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="my-courses"
        options={{
          tabBarLabel: 'My Learning',
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 30,
                borderRadius: 15,
                backgroundColor: focused ? brand.primary + '18' : 'transparent',
              }}
            >
              <BookOpen
                size={21}
                color={color}
                strokeWidth={focused ? 2.5 : 1.8}
                fill={focused ? brand.primary + '22' : 'transparent'}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
