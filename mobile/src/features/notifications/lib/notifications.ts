import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Сервис для работы с push-уведомлениями
 * Использует Expo Notifications
 */

/**
 * Настройка обработчика уведомлений
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Запрос разрешения на отправку уведомлений
 */
export const requestPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Permission for notifications not granted');
      return false;
    }

    // Для Android нужно настроить канал
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

/**
 * Получение push token для отправки уведомлений
 */
export const getPushToken = async (): Promise<string | null> => {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: 'your-project-id', // Замените на ваш Expo project ID
    });

    return tokenData.data;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
};

/**
 * Отправка локального уведомления
 */
export const sendLocalNotification = async (
  title: string,
  body: string,
  data?: any
): Promise<void> => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
      },
      trigger: null, // Отправка немедленно
    });
  } catch (error) {
    console.error('Error sending local notification:', error);
  }
};

/**
 * Отправка уведомления о новой новости
 */
export const sendNewsNotification = async (
  articleTitle: string,
  articleUrl?: string
): Promise<void> => {
  await sendLocalNotification(
    'Новая новость',
    articleTitle,
    { url: articleUrl }
  );
};

/**
 * Настройка обработчиков уведомлений
 */
export const setupNotificationHandlers = (
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationTapped?: (response: Notifications.NotificationResponse) => void
) => {
  // Обработчик получения уведомления (когда приложение открыто)
  const receivedSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    }
  );

  // Обработчик нажатия на уведомление
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      if (onNotificationTapped) {
        onNotificationTapped(response);
      }
    }
  );

  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
};

