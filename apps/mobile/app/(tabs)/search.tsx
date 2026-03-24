import { useRouter } from 'expo-router';
import { BookOpen, Search, X } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CourseCard } from '@/components/course/CourseCard';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { href } from '@/lib/href';
import { useCoursesStore } from '@/lib/stores/useCoursesStore';
import type { Course } from '@/types';
import { useColorScheme } from '@/components/useColorScheme';
import { iconColors } from '@/constants/Colors';

export default function SearchScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const allCourses = useCoursesStore((s) => s.allCourses);
  const olympiadTypes = useCoursesStore((s) => s.olympiadTypes);
  const filters = useCoursesStore((s) => s.filters);
  const setFilters = useCoursesStore((s) => s.actions.setFilters);
  const loading = useCoursesStore((s) => s.loading);

  const [query, setQuery] = useState(filters.searchText);
  const [debounced, setDebounced] = useState(filters.searchText);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    setFilters({ searchText: debounced });
  }, [debounced, setFilters]);

  const filteredCourses = useMemo(() => {
    let list: Course[] = allCourses;
    const q = debounced.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.subtitle?.toLowerCase().includes(q) ?? false),
      );
    }
    if (filters.olympiadTypeId) {
      list = list.filter((c) => c.olympiad_type_id === filters.olympiadTypeId);
    }
    return list;
  }, [allCourses, debounced, filters.olympiadTypeId]);

  const onPickOlympiad = useCallback(
    (id: string | null) => setFilters({ olympiadTypeId: id }),
    [setFilters],
  );

  const empty = !loading && filteredCourses.length === 0;
  const hasQuery = debounced.trim().length > 0 || filters.olympiadTypeId !== null;

  return (
    <SafeAreaView className="flex-1 bg-ui-bg dark:bg-neutral-900" edges={['top', 'bottom']}>

      {/* Inline title + search bar */}
      <View className="bg-white dark:bg-neutral-900 px-5 pt-4 pb-3">
        <Text className="text-2xl font-display-black tracking-tight text-neutral-900 dark:text-neutral-50 mb-3">
          Explore
        </Text>
        <View className="flex-row items-center rounded-2xl border-2 border-ui-border dark:border-neutral-700 bg-ui-bg dark:bg-neutral-800 px-4 h-12">
          <Search size={16} color={isDark ? iconColors.muted : iconColors.subtle} strokeWidth={2.5} style={{ marginRight: 8 }} />
          <TextInput
            accessibilityLabel="Search courses"
            placeholder="Search courses, topics..."
            placeholderTextColor={isDark ? iconColors.muted : iconColors.subtle}
            value={query}
            onChangeText={setQuery}
            className="flex-1 text-base font-sans-medium text-neutral-900 dark:text-neutral-100"
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <X size={16} color={iconColors.subtle} strokeWidth={2.5} />
            </Pressable>
          )}
        </View>

        {/* Filter chips */}
        {olympiadTypes.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-3"
            contentContainerStyle={{ gap: 8 }}
          >
            <Pressable
              accessibilityRole="button"
              onPress={() => onPickOlympiad(null)}
              className={`flex-row items-center rounded-full px-5 py-2 border ${
                filters.olympiadTypeId === null
                  ? 'bg-brand-primary border-brand-dark'
                  : 'bg-white dark:bg-neutral-800 border-ui-border dark:border-neutral-700'
              }`}
            >
              <Text
                numberOfLines={1}
                className={`text-xs font-display uppercase tracking-wider ${
                  filters.olympiadTypeId === null ? 'text-white' : 'text-neutral-600 dark:text-neutral-300'
                }`}
              >
                All
              </Text>
            </Pressable>

            {olympiadTypes.map((o) => {
              const active = filters.olympiadTypeId === o.id;
              return (
                <Pressable
                  key={o.id}
                  accessibilityRole="button"
                  onPress={() => onPickOlympiad(o.id)}
                  className={`flex-row items-center rounded-full px-5 py-2 border ${
                    active
                      ? 'bg-brand-primary border-brand-dark'
                      : 'bg-white dark:bg-neutral-800 border-ui-border dark:border-neutral-700'
                  }`}
                >
                  <Text
                    numberOfLines={1}
                    className={`text-xs font-display uppercase tracking-wider ${
                      active ? 'text-white' : 'text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    {o.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* Results count */}
      {!loading && !empty && (
        <View className="px-5 pt-3 pb-1">
          <Text className="text-xs font-display text-neutral-400 uppercase tracking-wider">
            {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
            {hasQuery ? ' found' : ' available'}
          </Text>
        </View>
      )}

      {loading ? (
        <LoadingScreen />
      ) : empty ? (
        <View className="flex-1 items-center justify-center px-8">
          {hasQuery
            ? <Search size={48} color={iconColors.empty} strokeWidth={1.5} />
            : <BookOpen size={48} color={iconColors.empty} strokeWidth={1.5} />
          }
          <Text className="mt-4 text-xl font-display-black text-neutral-900 dark:text-neutral-100 text-center">
            {hasQuery ? 'No courses found' : 'No courses yet'}
          </Text>
          <Text className="mt-2 text-sm font-sans-medium text-neutral-500 text-center">
            {hasQuery
              ? 'Try a different search or clear the filters'
              : 'Check back soon — new content is on the way'}
          </Text>
          {hasQuery && (
            <Pressable
              onPress={() => { setQuery(''); onPickOlympiad(null); }}
              className="mt-5 rounded-2xl border-2 border-brand-primary px-6 py-2.5"
            >
              <Text className="text-sm font-display text-brand-primary">Clear filters</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredCourses}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => (
            <CourseCard course={item} onPress={() => router.push(href(`/course/${item.id}`))} />
          )}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
        />
      )}

    </SafeAreaView>
  );
}
