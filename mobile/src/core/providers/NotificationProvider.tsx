import React, { useEffect } from 'react';
import { requestPermissions, setupNotificationHandlers, sendNewsNotification } from '@/features/notifications/lib/notifications';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/shared/config/store';

interface NotificationProviderProps {
  children: React.ReactNode;
}

/**
 * Провайдер для настройки push-уведомлений
 * Инициализирует разрешения и обработчики
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let interval: NodeJS.Timeout | undefined;

    try {
      // Запрашиваем разрешения при запуске
      requestPermissions().catch((error) => {
        console.warn('Failed to request notification permissions:', error);
      });

      // Настраиваем обработчики уведомлений
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

      // Пример: отправка тестового уведомления каждые 30 секунд (для демонстрации)
      // В реальном приложении это должно быть настроено через сервер
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

