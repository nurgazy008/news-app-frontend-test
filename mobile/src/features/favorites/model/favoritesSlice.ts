import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FavoriteNews } from '@/entities/news/model/types';

interface FavoritesState {
  favorites: FavoriteNews[];
}

const initialState: FavoritesState = {
  favorites: [],
};

// Favorites slice
// Syncs with AsyncStorage
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<FavoriteNews>) => {
      const exists = state.favorites.some((fav) => fav.url === action.payload.url);
      if (!exists) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter((fav) => fav.url !== action.payload);
    },
    setFavorites: (state, action: PayloadAction<FavoriteNews[]>) => {
      state.favorites = action.payload;
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
});

export const { addFavorite, removeFavorite, setFavorites, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;

