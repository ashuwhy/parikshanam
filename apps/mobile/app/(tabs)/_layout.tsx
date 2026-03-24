import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import Colors from '@/constants/Colors';
import { colors, darkColors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const c = isDark ? darkColors : colors;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[isDark ? 'dark' : 'light'].tint,
        tabBarInactiveTintColor: isDark ? darkColors.text.tertiary : colors.text.quaternary,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: isDark ? darkColors.background.primary : colors.surface.card,
          borderTopColor: isDark ? darkColors.background.secondary : colors.background.primary,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
        headerStyle: {
          backgroundColor: isDark ? darkColors.background.primary : colors.surface.card,
          shadowColor: 'transparent',
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? darkColors.background.secondary : colors.background.primary,
        },
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 18,
          color: isDark ? darkColors.text.primary : colors.text.primary,
        },
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <SymbolView
                name={{ ios: focused ? 'house.fill' : 'house', android: 'home', web: 'home' }}
                tintColor={color}
                size={24}
              />
            </View>
          ),
          headerTitle: 'Parikshanam',
          headerRight: () => <Avatar />,
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: 'Explore',
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <SymbolView
              name={{ ios: focused ? 'magnifyingglass.circle.fill' : 'magnifyingglass', android: 'search', web: 'search' }}
              tintColor={color}
              size={24}
            />
          ),
          headerTitle: 'Explore Courses',
        }}
      />

      <Tabs.Screen
        name="my-courses"
        options={{
          title: 'My Learning',
          tabBarLabel: 'My Learning',
          tabBarIcon: ({ color, focused }) => (
            <SymbolView
              name={{ ios: focused ? 'book.fill' : 'book', android: 'menu_book', web: 'menu_book' }}
              tintColor={color}
              size={24}
            />
          ),
          headerTitle: 'My Learning',
          headerRight: () => <Avatar />,
        }}
      />
    </Tabs>
  );
}
