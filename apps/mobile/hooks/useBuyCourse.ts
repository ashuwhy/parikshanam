import { useState } from 'react';
import Toast from 'react-native-toast-message';

import type { Course } from '@/types';

export function useBuyCourse(_course: Course | null | undefined) {
  const [buying] = useState(false);

  const buy = async () => {
    Toast.show({ type: 'info', text1: 'Payments coming soon!', text2: 'We\'ll notify you when enrollment opens.' });
  };

  return { buy, buying };
}
