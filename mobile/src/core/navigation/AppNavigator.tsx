import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '@/shared/config/store';

// Screens
import { AuthScreen } from '@/features/auth/ui/AuthScreen';
import { NewsListPage } from '@/pages/news-list/ui/NewsListPage';
import { NewsDetailPage } from '@/pages/news-detail/ui/NewsDetailPage';
import { FavoritesPage } from '@/pages/favorites/ui/FavoritesPage';
import { FileUploadScreen } from '@/features/file-upload/ui/FileUploadScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Главный навигатор с табами
 */
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="NewsList"
        component={NewsListPage}
        options={{
          title: 'Новости',
          tabBarIcon: ({ color }) => <TabIcon emoji="📰" color={color} />,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesPage}
        options={{
          title: 'Избранное',
          tabBarIcon: ({ color }) => <TabIcon emoji="❤️" color={color} />,
        }}
      />
      <Tab.Screen
        name="Files"
        component={FileUploadScreen}
        options={{
          title: 'Файлы',
          tabBarIcon: ({ color }) => <TabIcon emoji="📁" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Простой компонент иконки для табов
 */
const TabIcon: React.FC<{ emoji: string; color: string }> = ({ emoji }) => (
  <Text style={{ fontSize: 20 }}>{emoji}</Text>
);

/**
 * Главный навигатор приложения
 * Показывает AuthScreen если не авторизован, иначе MainTabs
 */
export const AppNavigator: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="NewsDetail"
              component={NewsDetailPage}
              options={{
                headerShown: true,
                title: 'Статья',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

