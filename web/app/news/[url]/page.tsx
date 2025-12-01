'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/shared/config/store';
import { addFavorite, removeFavorite } from '@/features/favorites/model/favoritesSlice';
import { saveFavorites } from '@/shared/lib/storage';
import { FavoriteNews, NewsArticle } from '@/entities/news/model/types';

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector((state: RootState) => state.favorites.favorites);
  
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // В реальном приложении здесь должен быть запрос к API для получения статьи
    // Для демонстрации используем данные из favorites или создаем mock
    const url = decodeURIComponent(params.url as string);
    const favorite = favorites.find((fav) => fav.url === url);
    
    if (favorite) {
      setArticle(favorite);
      setLoading(false);
    } else {
      // Mock данные для демонстрации
      setArticle({
        url,
        title: 'Пример новости',
        description: 'Описание новости',
        content: 'Полное содержание новости...',
        author: 'Автор',
        publishedAt: new Date().toISOString(),
        source: { id: null, name: 'Источник' },
        urlToImage: null,
      });
      setLoading(false);
    }
  }, [params.url, favorites]);

  if (loading || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.some((fav) => fav.url === article.url);

  const handleToggleFavorite = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Назад
          </button>
          <h1 className="text-xl font-bold">Статья</h1>
          <div></div>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 py-8">
        {article.urlToImage && (
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
        )}

        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
          {article.author && <span>Автор: {article.author}</span>}
          <span>{new Date(article.publishedAt).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}</span>
          {article.source.name && <span>Источник: {article.source.name}</span>}
        </div>

        {article.description && (
          <p className="text-xl text-gray-700 mb-6 font-medium">{article.description}</p>
        )}

        {article.content && (
          <div className="prose max-w-none mb-8">
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">{article.content}</p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleToggleFavorite}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              isFavorite
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {isFavorite ? '❤️ Удалить из избранного' : '🤍 Добавить в избранное'}
          </button>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            🌐 Открыть оригинал
          </a>
        </div>
      </article>
    </div>
  );
}

