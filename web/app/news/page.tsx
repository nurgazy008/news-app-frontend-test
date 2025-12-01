'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/shared/config/store';
import { useGetNewsQuery } from '@/entities/news/api/newsApi';
import { NewsArticle } from '@/entities/news/model/types';
import { addFavorite, removeFavorite, setFavorites } from '@/features/favorites/model/favoritesSlice';
import { saveFavorites, loadFavorites, saveAuthState } from '@/shared/lib/storage';
import { FavoriteNews } from '@/entities/news/model/types';
import { logout } from '@/features/auth/model/authSlice';
import { FiltersPanel, FilterOptions } from '@/widgets/filters/ui/FiltersPanel';

export default function NewsPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector((state: RootState) => state.favorites.favorites);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({});

  const { data, isLoading, error, refetch } = useGetNewsQuery({
    q: searchQuery || undefined,
    page,
    pageSize: 20,
    category: filters.category,
    country: filters.country,
    sortBy: filters.sortBy,
    from: filters.from,
    to: filters.to,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    // Загрузка избранного
    const savedFavorites = loadFavorites();
    if (savedFavorites.length > 0) {
      dispatch(setFavorites(savedFavorites));
    }
  }, [isAuthenticated, router, dispatch]);

  useEffect(() => {
    if (data?.articles) {
      if (page === 1) {
        setArticles(data.articles);
      } else {
        setArticles((prev) => [...prev, ...data.articles]);
      }
    }
  }, [data, page]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    setArticles([]);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPage(1);
    setArticles([]);
  };

  const handleToggleFavorite = (article: NewsArticle) => {
    const isFavorite = favorites.some((fav) => fav.url === article.url);
    
    if (isFavorite) {
      dispatch(removeFavorite(article.url));
    } else {
      const favoriteNews: FavoriteNews = {
        ...article,
        savedAt: Date.now(),
      };
      dispatch(addFavorite(favoriteNews));
    }

    const updatedFavorites = isFavorite
      ? favorites.filter((fav) => fav.url !== article.url)
      : [...favorites, { ...article, savedAt: Date.now() }];
    saveFavorites(updatedFavorites);
  };

  const isArticleFavorite = (url: string) => {
    return favorites.some((fav) => fav.url === url);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Новости</h1>
          <button
            onClick={() => {
              dispatch(logout());
              saveAuthState(false);
              router.push('/auth');
            }}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Выйти
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск новостей..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Поиск
            </button>
          </div>
        </form>

        <FiltersPanel filters={filters} onFiltersChange={handleFiltersChange} />

        {isLoading && articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Загрузка новостей...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Ошибка загрузки новостей</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Повторить
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <div
                key={article.url || index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(`/news/${encodeURIComponent(article.url)}`)}
              >
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-lg font-bold mb-2 line-clamp-2">{article.title}</h2>
                  {article.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">{article.description}</p>
                  )}
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{new Date(article.publishedAt).toLocaleDateString('ru-RU')}</span>
                    {article.source.name && <span>{article.source.name}</span>}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(article);
                    }}
                    className="mt-3 text-2xl"
                  >
                    {isArticleFavorite(article.url) ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {articles.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Загрузка...' : 'Загрузить еще'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

