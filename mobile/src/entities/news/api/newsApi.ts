import { baseApi, NEWS_API_KEY } from '@/shared/api/baseApi';
import { NewsResponse, NewsParams } from '../model/types';

/**
 * API для работы с новостями
 * Использует NewsAPI для получения списка новостей
 */
export const newsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Получение списка новостей с поддержкой фильтрации и пагинации
     */
    getNews: builder.query<NewsResponse, NewsParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        
        // Добавляем API ключ
        searchParams.append('apiKey', NEWS_API_KEY);
        
        if (params.country) searchParams.append('country', params.country);
        if (params.category) searchParams.append('category', params.category);
        if (params.q) searchParams.append('q', params.q);
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());
        if (params.from) searchParams.append('from', params.from);
        if (params.to) searchParams.append('to', params.to);
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);

        // Если нет параметров, используем топ-новости
        const endpoint = params.q || params.category || params.country 
          ? '/everything' 
          : '/top-headlines';
        
        // Для top-headlines нужен country или category
        if (endpoint === '/top-headlines' && !params.country && !params.category) {
          searchParams.append('country', 'us'); // по умолчанию
        }

        return {
          url: endpoint,
          params: Object.fromEntries(searchParams),
        };
      },
      providesTags: ['News'],
    }),
  }),
});

export const { useGetNewsQuery, useLazyGetNewsQuery } = newsApi;

