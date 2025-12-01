import { FavoriteNews } from '@/entities/news/model/types';

const FAVORITES_KEY = 'favorites';
const AUTH_KEY = 'auth';

/**
 * Утилиты для работы с локальным хранилищем (localStorage для веб)
 */

/**
 * Сохранение избранных новостей
 */
export const saveFavorites = (favorites: FavoriteNews[]): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
};

/**
 * Загрузка избранных новостей
 */
export const loadFavorites = (): FavoriteNews[] => {
  try {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    }
    return [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

/**
 * Сохранение состояния аутентификации
 */
export const saveAuthState = (isAuthenticated: boolean): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, JSON.stringify({ isAuthenticated }));
    }
  } catch (error) {
    console.error('Error saving auth state:', error);
  }
};

/**
 * Загрузка состояния аутентификации
 */
export const loadAuthState = (): boolean => {
  try {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(AUTH_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return parsed.isAuthenticated || false;
      }
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
export const clearStorage = (): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(FAVORITES_KEY);
      localStorage.removeItem(AUTH_KEY);
    }
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

