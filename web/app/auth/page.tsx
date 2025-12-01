'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/shared/config/store';
import { setAuthenticated, setLoading } from '@/features/auth/model/authSlice';
import { saveAuthState } from '@/shared/lib/storage';

export default function AuthPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  const handleLogin = async () => {
    dispatch(setLoading(true));
    // Простая аутентификация для веб-версии
    await new Promise((resolve) => setTimeout(resolve, 500));
    dispatch(setAuthenticated(true));
    saveAuthState(true);
    dispatch(setLoading(false));
    router.push('/news');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-2">Новостное приложение</h1>
        <p className="text-center text-gray-600 mb-8">Войдите для продолжения</p>
        
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
        
        <p className="text-sm text-gray-500 text-center mt-4">
          Для веб-версии используется упрощенная аутентификация
        </p>
      </div>
    </div>
  );
}


