import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider } from './src/core/providers/StoreProvider';
import { NotificationProvider } from './src/core/providers/NotificationProvider';
import { AppNavigator } from './src/core/navigation/AppNavigator';

/**
 * Главный компонент приложения
 * Инициализирует провайдеры и навигацию
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <NotificationProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </NotificationProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
