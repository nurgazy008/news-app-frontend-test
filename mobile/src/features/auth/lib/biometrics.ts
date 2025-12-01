import ReactNativeBiometrics from 'react-native-biometrics';

// Инициализация с обработкой ошибок для Expo Go
let rnBiometrics: ReactNativeBiometrics | null = null;
try {
  rnBiometrics = new ReactNativeBiometrics();
} catch (error) {
  console.warn('Biometrics not available:', error);
}

/**
 * Утилиты для работы с биометрической аутентификацией
 * Поддерживает Touch ID (iOS/Android) и Face ID (iOS)
 */

export interface BiometricResult {
  success: boolean;
  error?: string;
}

/**
 * Проверка доступности биометрии на устройстве
 */
export const checkBiometrics = async (): Promise<{
  available: boolean;
  biometryType?: string;
}> => {
  try {
    if (!rnBiometrics) {
      return { available: false };
    }
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    return { available, biometryType };
  } catch (error) {
    console.error('Error checking biometrics:', error);
    return { available: false };
  }
};

/**
 * Создание биометрического ключа (при первом использовании)
 */
export const createBiometricKey = async (): Promise<boolean> => {
  try {
    if (!rnBiometrics) {
      return false;
    }
    const { available } = await rnBiometrics.isSensorAvailable();
    if (!available) {
      return false;
    }

    const { keysExist } = await rnBiometrics.biometricKeysExist();
    if (!keysExist) {
      const { publicKey } = await rnBiometrics.createKeys();
      return !!publicKey;
    }
    return true;
  } catch (error) {
    console.error('Error creating biometric key:', error);
    return false;
  }
};

/**
 * Аутентификация с помощью биометрии
 */
export const authenticateWithBiometrics = async (): Promise<BiometricResult> => {
  try {
    if (!rnBiometrics) {
      return {
        success: false,
        error: 'Биометрическая аутентификация недоступна в Expo Go',
      };
    }
    const { available } = await rnBiometrics.isSensorAvailable();
    if (!available) {
      return {
        success: false,
        error: 'Биометрическая аутентификация недоступна на этом устройстве',
      };
    }

    const { keysExist } = await rnBiometrics.biometricKeysExist();
    if (!keysExist) {
      await createBiometricKey();
    }

    const promptMessage = 'Подтвердите вашу личность';
    const { success, error } = await rnBiometrics.simplePrompt({
      promptMessage,
      fallbackPromptMessage: 'Использовать пароль',
    });

    if (success) {
      return { success: true };
    } else {
      return {
        success: false,
        error: error || 'Аутентификация отменена',
      };
    }
  } catch (error: any) {
    console.error('Error authenticating with biometrics:', error);
    return {
      success: false,
      error: error?.message || 'Ошибка биометрической аутентификации',
    };
  }
};

/**
 * Удаление биометрических ключей (при logout)
 */
export const deleteBiometricKeys = async (): Promise<void> => {
  try {
    if (!rnBiometrics) {
      return;
    }
    await rnBiometrics.deleteKeys();
  } catch (error) {
    console.error('Error deleting biometric keys:', error);
  }
};

