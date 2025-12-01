import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';

export interface FilterOptions {
  category?: string;
  country?: string;
  from?: string;
  to?: string;
  sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
}

interface FiltersPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const CATEGORIES = [
  { value: '', label: 'Все категории' },
  { value: 'business', label: 'Бизнес' },
  { value: 'entertainment', label: 'Развлечения' },
  { value: 'general', label: 'Общее' },
  { value: 'health', label: 'Здоровье' },
  { value: 'science', label: 'Наука' },
  { value: 'sports', label: 'Спорт' },
  { value: 'technology', label: 'Технологии' },
];

const COUNTRIES = [
  { value: '', label: 'Все страны' },
  { value: 'us', label: 'США' },
  { value: 'gb', label: 'Великобритания' },
  { value: 'ru', label: 'Россия' },
  { value: 'de', label: 'Германия' },
  { value: 'fr', label: 'Франция' },
  { value: 'it', label: 'Италия' },
  { value: 'es', label: 'Испания' },
  { value: 'jp', label: 'Япония' },
  { value: 'cn', label: 'Китай' },
];

const SORT_OPTIONS = [
  { value: 'publishedAt', label: 'По дате' },
  { value: 'popularity', label: 'По популярности' },
  { value: 'relevancy', label: 'По релевантности' },
];

/**
 * Панель фильтров для новостей
 * Позволяет фильтровать по категориям, странам и сортировать
 */
export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  onFiltersChange,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setModalVisible(false);
  };

  const handleResetFilters = () => {
    const resetFilters: FilterOptions = {};
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    setModalVisible(false);
  };

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== ''
  ).length;

  return (
    <>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => {
          setLocalFilters(filters);
          setModalVisible(true);
        }}
      >
        <Text style={styles.filterButtonText}>
          🔍 Фильтры {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Фильтры</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Категории */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Категория</Text>
                <View style={styles.optionsContainer}>
                  {CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category.value}
                      style={[
                        styles.optionButton,
                        localFilters.category === category.value &&
                          styles.optionButtonActive,
                      ]}
                      onPress={() =>
                        setLocalFilters({
                          ...localFilters,
                          category: category.value || undefined,
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.optionText,
                          localFilters.category === category.value &&
                            styles.optionTextActive,
                        ]}
                      >
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Страны */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Страна</Text>
                <View style={styles.optionsContainer}>
                  {COUNTRIES.map((country) => (
                    <TouchableOpacity
                      key={country.value}
                      style={[
                        styles.optionButton,
                        localFilters.country === country.value &&
                          styles.optionButtonActive,
                      ]}
                      onPress={() =>
                        setLocalFilters({
                          ...localFilters,
                          country: country.value || undefined,
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.optionText,
                          localFilters.country === country.value &&
                            styles.optionTextActive,
                        ]}
                      >
                        {country.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Сортировка */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Сортировка</Text>
                <View style={styles.optionsContainer}>
                  {SORT_OPTIONS.map((sort) => (
                    <TouchableOpacity
                      key={sort.value}
                      style={[
                        styles.optionButton,
                        localFilters.sortBy === sort.value &&
                          styles.optionButtonActive,
                      ]}
                      onPress={() =>
                        setLocalFilters({
                          ...localFilters,
                          sortBy: sort.value as any,
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.optionText,
                          localFilters.sortBy === sort.value &&
                            styles.optionTextActive,
                        ]}
                      >
                        {sort.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetFilters}
              >
                <Text style={styles.resetButtonText}>Сбросить</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApplyFilters}
              >
                <Text style={styles.applyButtonText}>Применить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  modalBody: {
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  optionButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
  },
  optionTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

