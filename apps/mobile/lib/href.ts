import type { Href } from 'expo-router';

/** Cast until Expo Router regenerates typed routes after new files are picked up. */
export function href(path: string): Href {
  return path as Href;
}
