import type { Course } from '@/types';

/** Format paise as a rupee string e.g. ₹499 */
export function formatPrice(paise: number): string {
  return `₹${(paise / 100).toFixed(0)}`;
}

/** e.g. "Class 8", "Class 8–10", or null */
export function classRange(course: Course): string | null {
  const min = course.min_class?.label;
  const max = course.max_class?.label;
  if (min && max && min !== max) return `${min}–${max}`;
  if (min) return min;
  if (max) return max;
  return null;
}

/** Integer discount percentage */
export function discountPercent(price: number, mrp: number): number {
  return Math.round(((mrp - price) / mrp) * 100);
}
