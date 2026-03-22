import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CourseCard } from '@/components/course/CourseCard';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { href } from '@/lib/href';
import { useCoursesStore } from '@/lib/stores/useCoursesStore';
import type { Course } from '@/types';

export default function SearchScreen() {
  const router = useRouter();
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
    (id: string | null) => {
      setFilters({ olympiadTypeId: id });
    },
    [setFilters],
  );

  const empty = useMemo(
    () => !loading && filteredCourses.length === 0,
    [loading, filteredCourses.length],
  );

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-950" edges={['bottom']}>
      <View className="px-4 pt-2">
        <TextInput
          accessibilityLabel="Search courses"
          placeholder="Search courses..."
          placeholderTextColor="#9ca3af"
          value={query}
          onChangeText={setQuery}
          className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4 flex-row">
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: filters.olympiadTypeId === null }}
            onPress={() => onPickOlympiad(null)}
            className={`mr-2 rounded-full px-4 py-2 ${
              filters.olympiadTypeId === null ? 'bg-indigo-600' : 'bg-neutral-200 dark:bg-neutral-800'
            }`}>
            <Text
              className={`text-sm font-medium ${
                filters.olympiadTypeId === null ? 'text-white' : 'text-neutral-800 dark:text-neutral-200'
              }`}>
              All
            </Text>
          </Pressable>
          {olympiadTypes.map((o) => {
            const active = filters.olympiadTypeId === o.id;
            return (
              <Pressable
                key={o.id}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => onPickOlympiad(o.id)}
                className={`mr-2 rounded-full px-4 py-2 ${
                  active ? 'bg-indigo-600' : 'bg-neutral-200 dark:bg-neutral-800'
                }`}>
                <Text
                  className={`text-sm font-medium ${
                    active ? 'text-white' : 'text-neutral-800 dark:text-neutral-200'
                  }`}>
                  {o.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {loading ? (
        <LoadingScreen />
      ) : (
        <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 32 }}>
          {empty ? (
            <Text className="text-center text-neutral-500">No courses found</Text>
          ) : (
            filteredCourses.map((c) => (
              <CourseCard key={c.id} course={c} onPress={() => router.push(href(`/course/${c.id}`))} />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
