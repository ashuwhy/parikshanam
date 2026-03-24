import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CourseCard } from '@/components/course/CourseCard';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { href } from '@/lib/href';
import { useCoursesStore } from '@/lib/stores/useCoursesStore';
import type { Course } from '@/types';
import { useColorScheme } from '@/components/useColorScheme';

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
    <SafeAreaView className="flex-1 bg-ui-bg dark:bg-neutral-900" edges={['bottom']}>

      {/* Search bar */}
      <View className="border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 pt-3 pb-3">
        <View className="flex-row items-center rounded-2xl border-2 border-ui-border dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 h-12">
          <Text className="text-neutral-400 mr-2 text-base">🔍</Text>
          <TextInput
            accessibilityLabel="Search courses"
            placeholder="Search courses, topics..."
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            value={query}
            onChangeText={setQuery}
            className="flex-1 text-base font-medium text-neutral-900 dark:text-neutral-100"
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Text className="text-neutral-400 text-lg">✕</Text>
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
              className={`rounded-full px-4 py-1.5 border ${
                filters.olympiadTypeId === null
                  ? 'bg-brand-primary border-brand-dark'
                  : 'bg-white dark:bg-neutral-800 border-ui-border dark:border-neutral-700'
              }`}
            >
              <Text
                className={`text-xs font-black uppercase tracking-wider ${
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
                  className={`rounded-full px-4 py-1.5 border ${
                    active
                      ? 'bg-brand-primary border-brand-dark'
                      : 'bg-white dark:bg-neutral-800 border-ui-border dark:border-neutral-700'
                  }`}
                >
                  <Text
                    className={`text-xs font-black uppercase tracking-wider ${
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
          <Text className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
            {hasQuery ? ' found' : ' available'}
          </Text>
        </View>
      )}

      {loading ? (
        <LoadingScreen />
      ) : empty ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-5xl">{hasQuery ? '🔍' : '📚'}</Text>
          <Text className="mt-4 text-xl font-black text-neutral-900 dark:text-neutral-100 text-center">
            {hasQuery ? 'No courses found' : 'No courses yet'}
          </Text>
          <Text className="mt-2 text-sm font-medium text-neutral-500 text-center">
            {hasQuery
              ? 'Try a different search or clear the filters'
              : 'Check back soon — new content is on the way'}
          </Text>
          {hasQuery && (
            <Pressable
              onPress={() => { setQuery(''); onPickOlympiad(null); }}
              className="mt-5 rounded-2xl border-2 border-brand-primary px-6 py-2.5"
            >
              <Text className="text-sm font-black text-brand-primary">Clear filters</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-5 pt-2"
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {filteredCourses.map((c) => (
            <CourseCard key={c.id} course={c} onPress={() => router.push(href(`/course/${c.id}`))} />
          ))}
        </ScrollView>
      )}

    </SafeAreaView>
  );
}
