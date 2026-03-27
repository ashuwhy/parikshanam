import { CheckCircle, Star } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { cn } from '@/lib/cn';
import { brand, iconColors } from '@/constants/Colors';
import { classRange, discountPercent } from '@/lib/courseUtils';
import { olympiadLabel } from '@/types';
import type { Course } from '@/types';

// ─── Variant definitions ─────────────────────────────────────────────────────

export type BadgeVariant = 'olympiad' | 'class' | 'featured' | 'enrolled' | 'new' | 'discount';

const BADGE_STYLES: Record<BadgeVariant, { bg: string; text: string }> = {
  olympiad: { bg: 'bg-status-warning',                          text: 'text-brand-dark' },
  class:    { bg: 'bg-neutral-100 dark:bg-neutral-700',         text: 'text-neutral-700 dark:text-neutral-200' },
  featured: { bg: 'bg-brand-primary',                           text: 'text-white' },
  enrolled: { bg: 'bg-green-100 dark:bg-green-900/60',          text: 'text-green-700 dark:text-green-300' },
  new:      { bg: 'bg-blue-100 dark:bg-blue-900/60',            text: 'text-blue-700 dark:text-blue-300' },
  discount: { bg: 'bg-red-500',                                 text: 'text-white' },
};

// ─── Single badge pill ────────────────────────────────────────────────────────

type BadgeProps = {
  label: string;
  variant: BadgeVariant;
  icon?: ReactNode;
  /** Override bg/text for overlay-on-image usage (e.g. semi-transparent) */
  className?: string;
  textClassName?: string;
};

export function CourseBadge({ label, variant, icon, className, textClassName }: BadgeProps) {
  const { bg, text } = BADGE_STYLES[variant];
  return (
    <View className={cn('flex-row items-center gap-1 rounded-full px-3 py-1', bg, className)}>
      {icon ?? null}
      <Text numberOfLines={1} className={cn('text-xs font-display uppercase tracking-wider', text, textClassName)}>
        {label}
      </Text>
    </View>
  );
}

// ─── Composed badge row ───────────────────────────────────────────────────────

type CourseBadgesProps = {
  course: Course;
  purchased?: boolean;
  /** Use semi-transparent styles for class badge when overlaid on images */
  overlay?: boolean;
  className?: string;
};

/**
 * Renders a horizontal flex-row of all relevant badges for a course.
 * Use `overlay` when placing badges on top of a photo/video.
 */
export function CourseBadges({ course, purchased, overlay, className }: CourseBadgesProps) {
  const olympiad = olympiadLabel(course);
  const cls = classRange(course);

  return (
    <View className={cn('flex-row flex-wrap gap-2', className)}>
      {olympiad ? <CourseBadge label={olympiad} variant="olympiad" /> : null}

      {cls ? (
        <CourseBadge
          label={cls}
          variant="class"
          className={overlay ? 'bg-white/90 dark:bg-neutral-800/90' : undefined}
          textClassName={overlay ? 'text-neutral-700 dark:text-neutral-200' : undefined}
        />
      ) : null}

      {course.is_featured ? (
        <CourseBadge
          label="Featured"
          variant="featured"
          icon={<Star size={9} color={iconColors.onBrand} strokeWidth={2.5} />}
        />
      ) : null}

      {purchased ? (
        <CourseBadge
          label="Enrolled"
          variant="enrolled"
          icon={<CheckCircle size={10} color={brand.success} strokeWidth={2.5} />}
        />
      ) : null}
    </View>
  );
}
