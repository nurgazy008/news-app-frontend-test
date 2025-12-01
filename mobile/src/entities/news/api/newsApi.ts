import { baseApi, NEWS_API_KEY } from '@/shared/api/baseApi';
import { NewsResponse, NewsParams } from '../model/types';

// API for news
// Uses NewsAPI to get news list
export const newsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get news list with filters and pagination
    getNews: builder.query<NewsResponse, NewsParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        
        // Add API key
        searchParams.append('apiKey', NEWS_API_KEY);
        
        if (params.country) searchParams.append('country', params.country);
        if (params.category) searchParams.append('category', params.category);
        if (params.q) searchParams.append('q', params.q);
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());
        if (params.from) searchParams.append('from', params.from);
        if (params.to) searchParams.append('to', params.to);
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);

        // If no params, use top headlines
        const endpoint = params.q || params.category || params.country 
          ? '/everything' 
          : '/top-headlines';
        
        // Top headlines needs country or category
        if (endpoint === '/top-headlines' && !params.country && !params.category) {
          searchParams.append('country', 'us'); // default
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

