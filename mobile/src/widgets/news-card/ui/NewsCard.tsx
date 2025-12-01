import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import { NewsArticle } from '@/entities/news/model/types';

interface NewsCardProps {
  article: NewsArticle;
  onPress: (article: NewsArticle) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (article: NewsArticle) => void;
}

/**
 * Компонент карточки новости
 * Отображает заголовок, описание, дату и изображение
 */
export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  onPress,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(article)}
      activeOpacity={0.7}
    >
      {article.urlToImage && (
        <Image
          source={{ uri: article.urlToImage }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>
        
        {article.description && (
          <Text style={styles.description} numberOfLines={3}>
            {article.description}
          </Text>
        )}
        
        <View style={styles.footer}>
          <Text style={styles.date}>{formatDate(article.publishedAt)}</Text>
          {article.source.name && (
            <Text style={styles.source}>{article.source.name}</Text>
          )}
        </View>

        {onToggleFavorite && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => onToggleFavorite(article)}
          >
            <Text style={styles.favoriteIcon}>
              {isFavorite ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  source: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 24,
  },
});

