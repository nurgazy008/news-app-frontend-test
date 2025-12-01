import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  isBiometricEnabled: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isBiometricEnabled: false,
  isLoading: false,
};

/**
 * Слайс для управления состоянием аутентификации
 * Включает биометрическую аутентификацию
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setBiometricEnabled: (state, action: PayloadAction<boolean>) => {
      state.isBiometricEnabled = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.isBiometricEnabled = false;
    },
  },
});

export const { setAuthenticated, setBiometricEnabled, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;

