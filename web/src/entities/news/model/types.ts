/**
 * Типы данных для новостных статей (веб-версия)
 */

export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export interface NewsParams {
  country?: string;
  category?: string;
  q?: string; // поисковый запрос
  page?: number;
  pageSize?: number;
  from?: string; // дата в формате YYYY-MM-DD
  to?: string; // дата в формате YYYY-MM-DD
  sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
}

export interface FavoriteNews extends NewsArticle {
  savedAt: number; // timestamp сохранения
}


