import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteNews } from '@/entities/news/model/types';

const FAVORITES_KEY = '@favorites';
const AUTH_KEY = '@auth';

/**
 * Утилиты для работы с локальным хранилищем (AsyncStorage)
 */

/**
 * Сохранение избранных новостей
 */
export const saveFavorites = async (favorites: FavoriteNews[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites:', error);
    throw error;
  }
};

/**
 * Загрузка избранных новостей
 */
export const loadFavorites = async (): Promise<FavoriteNews[]> => {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

/**
 * Сохранение состояния аутентификации
 */
export const saveAuthState = async (isAuthenticated: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify({ isAuthenticated }));
  } catch (error) {
    console.error('Error saving auth state:', error);
    throw error;
  }
};

/**
 * Загрузка состояния аутентификации
 */
export const loadAuthState = async (): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem(AUTH_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.isAuthenticated || false;
    }
    return false;
  } catch (error) {
    console.error('Error loading auth state:', error);
    return false;
  }
};

/**
 * Очистка всех данных
 */
export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([FAVORITES_KEY, AUTH_KEY]);
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

