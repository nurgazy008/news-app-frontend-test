import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const NEWS_API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY || 'your_api_key_here';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

/**
 * Базовый API клиент с использованием RTK Query
 * Настроен для работы с NewsAPI
 * Примечание: NewsAPI требует ключ через query параметр apiKey
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: NEWS_API_BASE_URL,
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ['News', 'Favorites'],
  endpoints: () => ({}),
});

// Экспортируем ключ для использования в endpoints
export { NEWS_API_KEY };

