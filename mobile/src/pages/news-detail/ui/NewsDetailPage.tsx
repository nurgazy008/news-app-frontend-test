import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Header } from '@/widgets/header/ui/Header';
import { NewsArticle } from '@/entities/news/model/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/shared/config/store';
import { addFavorite, removeFavorite } from '@/features/favorites/model/favoritesSlice';
import { saveFavorites } from '@/shared/lib/storage';
import { FavoriteNews } from '@/entities/news/model/types';

interface NewsDetailPageProps {
  route: {
    params: {
      article: NewsArticle;
    };
  };
  navigation: any;
}

// News detail screen
// Shows full article info and WebView to read original article
export const NewsDetailPage: React.FC<NewsDetailPageProps> = ({ route, navigation }) => {
  const { article } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector((state: RootState) => state.favorites.favorites);
  
  const [showWebView, setShowWebView] = React.useState(false);
  const isFavorite = favorites.some((fav) => fav.url === article.url);

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Add or remove from favorites
  const handleToggleFavorite = async () => {
    if (isFavorite) {
      dispatch(removeFavorite(article.url));
      const updatedFavorites = favorites.filter((fav) => fav.url !== article.url);
      await saveFavorites(updatedFavorites);
    } else {
      const favoriteNews: FavoriteNews = {
        ...article,
        savedAt: Date.now(),
      };
      dispatch(addFavorite(favoriteNews));
      const updatedFavorites = [...favorites, favoriteNews];
      await saveFavorites(updatedFavorites);
    }
  };

  // Open original article in WebView
  const handleOpenWebView = () => {
    if (!article.url) {
      Alert.alert('Ошибка', 'URL статьи недоступен');
      return;
    }
    setShowWebView(true);
  };

  // Open article in external browser
  const handleOpenInBrowser = async () => {
    if (!article.url) {
      Alert.alert('Ошибка', 'URL статьи недоступен');
      return;
    }
    const supported = await Linking.canOpenURL(article.url);
    if (supported) {
      await Linking.openURL(article.url);
    } else {
      Alert.alert('Ошибка', 'Не удалось открыть ссылку');
    }
  };

  if (showWebView && article.url) {
    return (
      <View style={styles.container}>
        <Header title="Статья" showLogout={false} />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setShowWebView(false)}
        >
          <Text style={styles.closeButtonText}>✕ Закрыть</Text>
        </TouchableOpacity>
        <WebView
          source={{ uri: article.url }}
          style={styles.webview}
          startInLoadingState={true}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Статья" showLogout={false} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {article.urlToImage && (
          <Image
            source={{ uri: article.urlToImage }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <View style={styles.header}>
          <Text style={styles.title}>{article.title}</Text>
          
          {article.author && (
            <Text style={styles.author}>Автор: {article.author}</Text>
          )}
          
          <Text style={styles.date}>{formatDate(article.publishedAt)}</Text>
          
          {article.source.name && (
            <Text style={styles.source}>Источник: {article.source.name}</Text>
          )}
        </View>

        {article.description && (
          <Text style={styles.description}>{article.description}</Text>
        )}

        {article.content && (
          <Text style={styles.content}>{article.content}</Text>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.favoriteButton]}
            onPress={handleToggleFavorite}
          >
            <Text style={styles.buttonText}>
              {isFavorite ? '❤️ Удалить из избранного' : '🤍 Добавить в избранное'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.webviewButton]}
            onPress={handleOpenWebView}
          >
            <Text style={styles.buttonText}>📖 Открыть в приложении</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.browserButton]}
            onPress={handleOpenInBrowser}
          >
            <Text style={styles.buttonText}>🌐 Открыть в браузере</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    lineHeight: 32,
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  source: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  description: {
    fontSize: 18,
    color: '#333',
    lineHeight: 26,
    marginBottom: 16,
    fontWeight: '500',
  },
  content: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 24,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  favoriteButton: {
    backgroundColor: '#FF3B30',
  },
  webviewButton: {
    backgroundColor: '#007AFF',
  },
  browserButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  webview: {
    flex: 1,
  },
  closeButton: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});

