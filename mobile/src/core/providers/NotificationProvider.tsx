import React, { useEffect } from 'react';
import { requestPermissions, setupNotificationHandlers, sendNewsNotification } from '@/features/notifications/lib/notifications';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/shared/config/store';

interface NotificationProviderProps {
  children: React.ReactNode;
}

// Provider for push notifications setup
// Initializes permissions and handlers
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let interval: NodeJS.Timeout | undefined;

    try {
      // Request permissions on startup
      requestPermissions().catch((error) => {
        console.warn('Failed to request notification permissions:', error);
      });

      // Setup notification handlers
      cleanup = setupNotificationHandlers(
        (notification) => {
          console.log('Notification received:', notification);
          // Здесь можно обновить состояние приложения
        },
        (response) => {
          console.log('Notification tapped:', response);
          const url = response.notification.request.content.data?.url;
          if (url) {
            // Навигация к статье при нажатии на уведомление
            // Это будет реализовано в навигации
          }
        }
      );

      // Example: send test notification every 30 seconds (for demo)
      // In real app this should be setup through server
      // TODO: remove this in production, use real push notifications
      interval = setInterval(() => {
        sendNewsNotification(
          'Проверьте последние новости!',
          undefined
        ).catch((error) => {
          console.warn('Failed to send notification:', error);
        });
      }, 30000); // 30 секунд для демонстрации
    } catch (error) {
      console.warn('Failed to setup notifications:', error);
    }

    return () => {
      if (cleanup) {
        cleanup();
      }
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [dispatch]);

  return <>{children}</>;
};

