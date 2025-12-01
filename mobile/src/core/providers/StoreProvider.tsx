import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/shared/config/store';

interface StoreProviderProps {
  children: React.ReactNode;
}

// Redux store provider for app
export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

