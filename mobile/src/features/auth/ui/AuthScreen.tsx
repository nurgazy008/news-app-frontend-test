import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/shared/config/store';
import { setAuthenticated, setBiometricEnabled, setLoading } from '../model/authSlice';
import { authenticateWithBiometrics, checkBiometrics } from '../lib/biometrics';
import { loadAuthState, saveAuthState } from '@/shared/lib/storage';

/**
 * Экран аутентификации с биометрией
 * Показывается при первом запуске и после logout
 */
export const AuthScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState<string>('');

  useEffect(() => {
    checkBiometricAvailability();
    checkSavedAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Проверка доступности биометрии
   */
  const checkBiometricAvailability = async () => {
    const { available, biometryType: type } = await checkBiometrics();
    setBiometricAvailable(available);
    setBiometryType(type || '');
    dispatch(setBiometricEnabled(available));
  };

  /**
   * Проверка сохраненного состояния аутентификации
   */
  const checkSavedAuth = async () => {
    const isAuthenticated = await loadAuthState();
    if (isAuthenticated) {
      // Если была сохранена аутентификация, запрашиваем биометрию
      handleBiometricAuth();
    }
  };

  /**
   * Обработка биометрической аутентификации
   */
  const handleBiometricAuth = async () => {
    dispatch(setLoading(true));
    
    const result = await authenticateWithBiometrics();
    
    if (result.success) {
      dispatch(setAuthenticated(true));
      await saveAuthState(true);
    } else {
      Alert.alert(
        'Ошибка аутентификации',
        result.error || 'Не удалось пройти аутентификацию',
        [{ text: 'OK' }]
      );
    }
    
    dispatch(setLoading(false));
  };

  /**
   * Пропуск аутентификации (для тестирования)
   */
  const handleSkipAuth = async () => {
    dispatch(setAuthenticated(true));
    await saveAuthState(true);
  };

  const getBiometricButtonText = () => {
    if (biometryType === 'FaceID') return 'Войти с Face ID';
    if (biometryType === 'TouchID') return 'Войти с Touch ID';
    return 'Войти с биометрией';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Новостное приложение</Text>
      <Text style={styles.subtitle}>Войдите для продолжения</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <View style={styles.buttonContainer}>
          {biometricAvailable && (
            <TouchableOpacity
              style={styles.biometricButton}
              onPress={handleBiometricAuth}
            >
              <Text style={styles.biometricButtonText}>
                {getBiometricButtonText()}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkipAuth}
          >
            <Text style={styles.skipButtonText}>Пропустить</Text>
          </TouchableOpacity>
        </View>
      )}

      {!biometricAvailable && (
        <Text style={styles.hint}>
          Биометрическая аутентификация недоступна на этом устройстве
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  biometricButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  biometricButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    padding: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
  hint: {
    marginTop: 30,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

