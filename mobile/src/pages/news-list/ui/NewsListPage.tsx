import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useGetNewsQuery } from '@/entities/news/api/newsApi';
import { NewsArticle } from '@/entities/news/model/types';
import { NewsCard } from '@/widgets/news-card/ui/NewsCard';
import { SearchBar } from '@/widgets/search-bar/ui/SearchBar';
import { Header } from '@/widgets/header/ui/Header';
import { FiltersPanel, FilterOptions } from '@/widgets/filters/ui/FiltersPanel';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/shared/config/store';
import { addFavorite, removeFavorite, setFavorites } from '@/features/favorites/model/favoritesSlice';
import { saveFavorites, loadFavorites } from '@/shared/lib/storage';
import { FavoriteNews } from '@/entities/news/model/types';

interface NewsListPageProps {
  navigation: any;
}

/**
 * Главный экран со списком новостей
 * Включает поиск, фильтрацию, пагинацию и добавление в избранное
 */
export const NewsListPage: React.FC<NewsListPageProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector((state: RootState) => state.favorites.favorites);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [refreshing, setRefreshing] = useState(false);
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

  // Обновляем список статей при получении новых данных
  useEffect(() => {
    if (data?.articles) {
      if (page === 1) {
        setArticles(data.articles);
      } else {
        setArticles((prev) => [...prev, ...data.articles]);
      }
    }
  }, [data, page]);

  // Загрузка избранного при монтировании
  useEffect(() => {
    const loadSavedFavorites = async () => {
      const savedFavorites = await loadFavorites();
      if (savedFavorites.length > 0) {
        dispatch(setFavorites(savedFavorites));
      }
    };
    loadSavedFavorites();
  }, [dispatch]);

  /**
   * Обработка поиска
   */
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    setArticles([]);
  };

  /**
   * Обработка изменения фильтров
   */
  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPage(1);
    setArticles([]);
  };

  /**
   * Загрузка следующей страницы (бесконечная прокрутка)
   */
  const loadMore = () => {
    if (!isLoading && data && articles.length < data.totalResults) {
      setPage((prev) => prev + 1);
    }
  };

  /**
   * Обновление списка (pull-to-refresh)
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  /**
   * Переход на детальный экран
   */
  const handleArticlePress = (article: NewsArticle) => {
    navigation.navigate('NewsDetail', { article });
  };

  /**
   * Добавление/удаление из избранного
   */
  const handleToggleFavorite = async (article: NewsArticle) => {
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

    // Сохраняем в AsyncStorage
    const updatedFavorites = isFavorite
      ? favorites.filter((fav) => fav.url !== article.url)
      : [...favorites, { ...article, savedAt: Date.now() }];
    await saveFavorites(updatedFavorites);
  };

  /**
   * Проверка, находится ли статья в избранном
   */
  const isArticleFavorite = (url: string) => {
    return favorites.some((fav) => fav.url === url);
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Header title="Новости" />
        <Text style={styles.errorText}>Ошибка загрузки новостей</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Повторить</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Новости" />
      <SearchBar onSearch={handleSearch} />
      <FiltersPanel filters={filters} onFiltersChange={handleFiltersChange} />
      
      {isLoading && articles.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item, index) => item.url || index.toString()}
          renderItem={({ item }) => (
            <NewsCard
              article={item}
              onPress={handleArticlePress}
              isFavorite={isArticleFavorite(item.url)}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListFooterComponent={
            isLoading && articles.length > 0 ? (
              <ActivityIndicator size="small" color="#007AFF" style={styles.footerLoader} />
            ) : null
          }
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Новости не найдены</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerLoader: {
    paddingVertical: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

