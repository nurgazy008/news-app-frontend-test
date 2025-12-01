'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/shared/config/store';
import { loadAuthState } from '@/shared/lib/storage';
import { setAuthenticated } from '@/features/auth/model/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/shared/config/store';

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    // Проверяем сохраненное состояние аутентификации
    const savedAuth = loadAuthState();
    if (savedAuth) {
      dispatch(setAuthenticated(true));
      router.push('/news');
    } else {
      router.push('/auth');
    }
  }, [dispatch, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Загрузка...</h1>
      </div>
    </div>
  );
}
