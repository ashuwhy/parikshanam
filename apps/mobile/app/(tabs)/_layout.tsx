import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookOpen, Compass, House } from 'lucide-react-native';

import { brand, colors, darkColors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

// ── Animated pill wrapper ────────────────────────────────────────────────────

const SPRING_CONFIG = { damping: 18, stiffness: 220, mass: 0.8 };

type AnimatedTabIconProps = {
  focused: boolean;
  color: string;
  children: React.ReactNode;
};

function AnimatedTabIcon({ focused, color, children }: AnimatedTabIconProps) {
  const scale = useSharedValue(focused ? 1 : 0);
  const opacity = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(focused ? 1 : 0.6, SPRING_CONFIG);
    opacity.value = withSpring(focused ? 1 : 0, SPRING_CONFIG);
  }, [focused, scale, opacity]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: 56,
        height: 30,
      }}
    >
      {/* Animated background pill */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: 56,
            height: 30,
            borderRadius: 15,
            backgroundColor: brand.primary + '18',
          },
          pillStyle,
        ]}
      />
      {children}
    </View>
  );
}

// ── Tab layout ───────────────────────────────────────────────────────────────

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
          height: 76 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
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
            <AnimatedTabIcon focused={focused} color={color}>
              <House
                size={21}
                color={color}
                strokeWidth={focused ? 2.5 : 1.8}
                fill={focused ? brand.primary + '22' : 'transparent'}
              />
            </AnimatedTabIcon>
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused} color={color}>
              <Compass
                size={21}
                color={color}
                strokeWidth={focused ? 2.5 : 1.8}
              />
            </AnimatedTabIcon>
          ),
        }}
      />

      <Tabs.Screen
        name="my-courses"
        options={{
          tabBarLabel: 'My Learning',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon focused={focused} color={color}>
              <BookOpen
                size={21}
                color={color}
                strokeWidth={focused ? 2.5 : 1.8}
                fill={focused ? brand.primary + '22' : 'transparent'}
              />
            </AnimatedTabIcon>
          ),
        }}
      />
    </Tabs>
  );
}
