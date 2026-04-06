import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications() {
  const { session } = useAuth();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const router = useRouter();
  
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
      const rawData = response.notification.request.content.data;
      if (rawData?.url && typeof rawData.url === 'string') {
        router.push(rawData.url as any);
      }
    };

    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token ?? null);
      if (token) {
        saveTokenToDatabase(token, session?.user?.id);
      }
    });

    // Handle notification that was tapped to open the app (cold launch)
    Notifications.getLastNotificationResponseAsync().then(response => {
      if (response) {
        handleNotificationResponse(response);
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // Could capture local state here
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      handleNotificationResponse(response);
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [session?.user?.id]); // Re-run if user logs in/out to link token to new user ID

  return { expoPushToken };
}

async function saveTokenToDatabase(token: string, userId: string | undefined | null) {
  try {
    const { error } = await supabase.from('push_tokens').upsert(
      {
        token,
        platform: Platform.OS,
        user_id: userId ?? null,
      },
      { onConflict: 'token' }
    );
    if (error) {
      console.warn('Error saving push token to DB:', error);
    }
  } catch (err) {
    console.warn('Error saving push token:', err);
  }
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E8720C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      return null;
    }
    
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found in app.json');
      }
      const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
      return tokenData.data;
    } catch (error) {
      console.warn('Error getting expo push token:', error);
      return null;
    }
  } else {
    // Simulator doesn't support push notifications
    return null;
  }
}
