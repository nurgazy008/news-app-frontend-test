import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Header } from '@/widgets/header/ui/Header';
import { pickFile, uploadFile, downloadFile } from '../lib/fileService';

/**
 * Экран для работы с файлами
 * Позволяет отправлять и скачивать файлы
 */
export const FileUploadScreen: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);

  /**
   * Выбор и отправка файла
   */
  const handlePickAndUpload = async () => {
    setUploading(true);
    setUploadProgress(0);

    try {
      // Выбираем файл
      const pickResult = await pickFile();
      if (!pickResult.success || !pickResult.uri) {
        Alert.alert('Ошибка', pickResult.error || 'Не удалось выбрать файл');
        setUploading(false);
        return;
      }

      // Загружаем файл
      const uploadResult = await uploadFile(pickResult.uri, (progress) => {
        setUploadProgress(progress);
      });

      if (uploadResult.success) {
        Alert.alert('Успех', 'Файл успешно загружен');
      } else {
        Alert.alert('Ошибка', uploadResult.error || 'Не удалось загрузить файл');
      }
    } catch (error: any) {
      Alert.alert('Ошибка', error?.message || 'Произошла ошибка');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  /**
   * Скачивание файла
   */
  const handleDownload = async () => {
    setDownloading(true);
    setDownloadProgress(0);

    try {
      // Пример URL для скачивания (в реальном приложении это будет URL вашего API)
      const downloadUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
      const fileName = 'downloaded-file.pdf';

      const result = await downloadFile(downloadUrl, fileName, (progress) => {
        setDownloadProgress(progress);
      });

      if (!result.success) {
        Alert.alert('Ошибка', result.error || 'Не удалось скачать файл');
      }
    } catch (error: any) {
      Alert.alert('Ошибка', error?.message || 'Произошла ошибка');
    } finally {
      setDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Файлы" />
      
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Отправка файла</Text>
          <Text style={styles.sectionDescription}>
            Выберите файл с устройства и загрузите его на сервер
          </Text>

          <TouchableOpacity
            style={[styles.button, styles.uploadButton, uploading && styles.buttonDisabled]}
            onPress={handlePickAndUpload}
            disabled={uploading}
          >
            {uploading ? (
              <View style={styles.progressContainer}>
                <ActivityIndicator color="#fff" style={styles.loader} />
                <Text style={styles.buttonText}>
                  Загрузка... {Math.round(uploadProgress * 100)}%
                </Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>📤 Выбрать и отправить файл</Text>
            )}
          </TouchableOpacity>

          {uploading && uploadProgress > 0 && (
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${uploadProgress * 100}%` }]} />
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Скачивание файла</Text>
          <Text style={styles.sectionDescription}>
            Скачайте файл с сервера на устройство
          </Text>

          <TouchableOpacity
            style={[styles.button, styles.downloadButton, downloading && styles.buttonDisabled]}
            onPress={handleDownload}
            disabled={downloading}
          >
            {downloading ? (
              <View style={styles.progressContainer}>
                <ActivityIndicator color="#fff" style={styles.loader} />
                <Text style={styles.buttonText}>
                  Скачивание... {Math.round(downloadProgress * 100)}%
                </Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>📥 Скачать файл</Text>
            )}
          </TouchableOpacity>

          {downloading && downloadProgress > 0 && (
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${downloadProgress * 100}%` }]} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#007AFF',
  },
  downloadButton: {
    backgroundColor: '#34C759',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loader: {
    marginRight: 8,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
});

