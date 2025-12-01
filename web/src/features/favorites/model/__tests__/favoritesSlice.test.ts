import favoritesReducer, {
  addFavorite,
  removeFavorite,
  setFavorites,
  clearFavorites,
} from '../favoritesSlice';
import { FavoriteNews } from '@/entities/news/model/types';

const mockArticle: FavoriteNews = {
  source: { id: '1', name: 'Test Source' },
  author: 'Test Author',
  title: 'Test Title',
  description: 'Test Description',
  url: 'https://test.com',
  urlToImage: 'https://test.com/image.jpg',
  publishedAt: '2024-01-01T00:00:00Z',
  content: 'Test Content',
  savedAt: Date.now(),
};

describe('favoritesSlice', () => {
  const initialState = { favorites: [] };

  it('should return initial state', () => {
    expect(favoritesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addFavorite', () => {
    const action = addFavorite(mockArticle);
    const state = favoritesReducer(initialState, action);
    expect(state.favorites).toHaveLength(1);
    expect(state.favorites[0]).toEqual(mockArticle);
  });

  it('should not add duplicate favorite', () => {
    const stateWithFavorite = favoritesReducer(initialState, addFavorite(mockArticle));
    const state = favoritesReducer(stateWithFavorite, addFavorite(mockArticle));
    expect(state.favorites).toHaveLength(1);
  });

  it('should handle removeFavorite', () => {
    const stateWithFavorite = favoritesReducer(initialState, addFavorite(mockArticle));
    const state = favoritesReducer(stateWithFavorite, removeFavorite(mockArticle.url));
    expect(state.favorites).toHaveLength(0);
  });

  it('should handle setFavorites', () => {
    const favorites = [mockArticle];
    const state = favoritesReducer(initialState, setFavorites(favorites));
    expect(state.favorites).toEqual(favorites);
  });

  it('should handle clearFavorites', () => {
    const stateWithFavorite = favoritesReducer(initialState, addFavorite(mockArticle));
    const state = favoritesReducer(stateWithFavorite, clearFavorites());
    expect(state.favorites).toHaveLength(0);
  });
});


