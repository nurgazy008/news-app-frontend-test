import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const NEWS_API_KEY = process.env.EXPO_PUBLIC_NEWS_API_KEY || 'your_api_key_here';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// Base API client using RTK Query
// Configured for NewsAPI
// Note: NewsAPI needs apiKey in query params
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

// Export API key for use in endpoints
export { NEWS_API_KEY };

