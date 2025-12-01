import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/shared/config/store';
import { removeFavorite, setFavorites } from '@/features/favorites/model/favoritesSlice';
import { loadFavorites, saveFavorites } from '@/shared/lib/storage';
import { NewsCard } from '@/widgets/news-card/ui/NewsCard';
import { Header } from '@/widgets/header/ui/Header';
import { NewsArticle } from '@/entities/news/model/types';

interface FavoritesPageProps {
  navigation: any;
}

/**
 * Экран избранных новостей
 * Показывает сохраненные статьи с возможностью удаления
 */
export const FavoritesPage: React.FC<FavoritesPageProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector((state: RootState) => state.favorites.favorites);

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
   * Переход на детальный экран
   */
  const handleArticlePress = (article: NewsArticle) => {
    navigation.navigate('NewsDetail', { article });
  };

  /**
   * Удаление из избранного
   */
  const handleRemoveFavorite = async (url: string) => {
    dispatch(removeFavorite(url));
    const updatedFavorites = favorites.filter((fav) => fav.url !== url);
    await saveFavorites(updatedFavorites);
  };

  return (
    <View style={styles.container}>
      <Header title="Избранное" />
      
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Нет избранных новостей</Text>
          <Text style={styles.emptySubtext}>
            Добавьте новости в избранное, чтобы они отображались здесь
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.url || item.savedAt.toString()}
          renderItem={({ item }) => (
            <NewsCard
              article={item}
              onPress={handleArticlePress}
              isFavorite={true}
              onToggleFavorite={() => handleRemoveFavorite(item.url)}
            />
          )}
          contentContainerStyle={styles.listContent}
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
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

