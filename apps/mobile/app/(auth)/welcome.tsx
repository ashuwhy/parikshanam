import { Image } from 'expo-image';
import { Calculator, FlaskConical, Globe, Laptop, User } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { iconColors } from '@/constants/Colors';
import Logo from '../../assets/images/icon.png';

const SUBJECTS = [
  { Icon: Calculator, label: 'Math' },
  { Icon: FlaskConical, label: 'Science' },
  { Icon: Globe, label: 'Geography' },
  { Icon: Laptop, label: 'Computing' },
];

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-ui-bg dark:bg-neutral-900">
      <View className="flex-1 justify-between px-6 pb-10 pt-8">

        {/* Hero */}
        <View className="flex-1 items-center justify-center">

          {/* Logo */}
          <Image source={Logo} style={{ width: 140, height: 140 }} contentFit="contain" />

          {/* Wordmark */}
          <Text className="mt-5 text-4xl font-display-black tracking-tight text-brand-primary">
            Parikshanam
          </Text>
          <Text className="mt-0 text-base font-sans-medium text-neutral-500 dark:text-neutral-400 text-center leading-relaxed">
            The Olympiad learning app.{'\n'}Learn smart. Compete hard. Win big.
          </Text>

          {/* Subject pills */}
          <View className="mt-8 flex-row justify-center gap-2 px-6">
            {SUBJECTS.map(({ Icon, label }) => (
              <View
                key={label}
                className="w-[78px] items-center justify-center rounded-2xl border border-ui-border dark:border-neutral-700 bg-white dark:bg-neutral-800 py-2.5"
              >
                <Icon size={20} color={iconColors.secondary} strokeWidth={2} />
                <Text className="mt-1 text-[10px] font-display uppercase tracking-tight text-neutral-600 dark:text-neutral-400">
                  {label}
                </Text>
              </View>
            ))}
          </View>

          {/* Social proof */}
          <View className="mt-8 flex-row items-center gap-2">
            <View className="flex-row">
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  className="h-7 w-7 items-center justify-center rounded-full bg-brand-primary border-2 border-white dark:border-neutral-900"
                  style={{ marginLeft: i === 0 ? 0 : -8 }}
                >
                  <User size={14} color={iconColors.onBrand} strokeWidth={2.5} />
                </View>
              ))}
            </View>
            <Text className="text-sm font-sans-medium text-neutral-600 dark:text-neutral-400">
              Join <Text className="text-brand-primary font-display-black">10,000+</Text> students
            </Text>
          </View>
        </View>

        {/* CTA */}
        <View className="gap-4">
          <GoogleSignInButton />
          <Text className="text-center text-xs font-sans-medium text-neutral-400 dark:text-neutral-500">
            By continuing you agree to our{' '}
            <Text className="font-sans-bold text-neutral-500 dark:text-neutral-400">Terms &amp; Privacy Policy</Text>
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}
