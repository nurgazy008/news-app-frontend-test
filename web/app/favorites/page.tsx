'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/shared/config/store';
import { removeFavorite, setFavorites } from '@/features/favorites/model/favoritesSlice';
import { loadFavorites, saveFavorites, saveAuthState } from '@/shared/lib/storage';
import { NewsArticle } from '@/entities/news/model/types';
import { logout } from '@/features/auth/model/authSlice';

export default function FavoritesPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector((state: RootState) => state.favorites.favorites);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    const savedFavorites = loadFavorites();
    if (savedFavorites.length > 0) {
      dispatch(setFavorites(savedFavorites));
    }
  }, [isAuthenticated, router, dispatch]);

  const handleRemoveFavorite = (url: string) => {
    dispatch(removeFavorite(url));
    const updatedFavorites = favorites.filter((fav) => fav.url !== url);
    saveFavorites(updatedFavorites);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Избранное</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/news')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Новости
            </button>
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
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-2">Нет избранных новостей</p>
            <p className="text-gray-500 mb-6">
              Добавьте новости в избранное, чтобы они отображались здесь
            </p>
            <button
              onClick={() => router.push('/news')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Перейти к новостям
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((article, index) => (
              <div
                key={article.url || index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => router.push(`/news/${encodeURIComponent(article.url)}`)}
                  />
                )}
                <div className="p-4">
                  <h2
                    className="text-lg font-bold mb-2 line-clamp-2 cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/news/${encodeURIComponent(article.url)}`)}
                  >
                    {article.title}
                  </h2>
                  {article.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">{article.description}</p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {new Date(article.publishedAt).toLocaleDateString('ru-RU')}
                    </span>
                    <button
                      onClick={() => handleRemoveFavorite(article.url)}
                      className="text-2xl hover:scale-110 transition-transform"
                    >
                      ❤️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


