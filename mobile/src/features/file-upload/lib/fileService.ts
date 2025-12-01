import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';

/**
 * Сервис для работы с файлами
 * Включает отправку и скачивание файлов
 */

export interface FileUploadResult {
  success: boolean;
  uri?: string;
  error?: string;
}

/**
 * Выбор файла с устройства
 */
export const pickFile = async (): Promise<FileUploadResult> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return { success: false, error: 'Выбор файла отменен' };
    }

    const file = result.assets[0];
    return {
      success: true,
      uri: file.uri,
    };
  } catch (error: any) {
    console.error('Error picking file:', error);
    return {
      success: false,
      error: error?.message || 'Ошибка при выборе файла',
    };
  }
};

/**
 * Загрузка файла на сервер
 * В данном примере используется mock-сервер, в реальном приложении замените на ваш API
 */
export const uploadFile = async (
  fileUri: string,
  onProgress?: (progress: number) => void
): Promise<FileUploadResult> => {
  try {
    // В реальном приложении здесь должен быть ваш API endpoint
    const uploadUrl = 'https://httpbin.org/post'; // Mock endpoint для тестирования

    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) {
      return { success: false, error: 'Файл не найден' };
    }

    const uploadResult = await FileSystem.uploadAsync(uploadUrl, fileUri, {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'file',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (uploadResult.status === 200) {
      return { success: true, uri: uploadResult.uri };
    } else {
      return {
        success: false,
        error: `Ошибка загрузки: статус ${uploadResult.status}`,
      };
    }
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: error?.message || 'Ошибка при загрузке файла',
    };
  }
};

/**
 * Скачивание файла с сервера
 */
export const downloadFile = async (
  url: string,
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<FileUploadResult> => {
  try {
    const fileUri = FileSystem.documentDirectory + fileName;

    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      fileUri,
      {},
      (downloadProgress) => {
        const progress =
          downloadProgress.totalBytesWritten /
          downloadProgress.totalBytesExpectedToWrite;
        if (onProgress) {
          onProgress(progress);
        }
      }
    );

    const result = await downloadResumable.downloadAsync();

    if (result) {
      Alert.alert('Успех', `Файл сохранен: ${result.uri}`);
      return { success: true, uri: result.uri };
    } else {
      return { success: false, error: 'Ошибка скачивания файла' };
    }
  } catch (error: any) {
    console.error('Error downloading file:', error);
    return {
      success: false,
      error: error?.message || 'Ошибка при скачивании файла',
    };
  }
};

