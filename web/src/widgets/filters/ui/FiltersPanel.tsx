'use client';

import React, { useState } from 'react';

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
 * Панель фильтров для новостей (веб-версия)
 */
export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  onFiltersChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== ''
  ).length;

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const handleReset = () => {
    onFiltersChange({});
  };

  return (
    <div className="mb-4">
      <div className="flex gap-2 items-center flex-wrap">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          🔍 Фильтры {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </button>

        {activeFiltersCount > 0 && (
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Сбросить
          </button>
        )}
      </div>

      {isOpen && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Категории */}
            <div>
              <label className="block text-sm font-semibold mb-2">Категория</label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Страны */}
            <div>
              <label className="block text-sm font-semibold mb-2">Страна</label>
              <select
                value={filters.country || ''}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {COUNTRIES.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Сортировка */}
            <div>
              <label className="block text-sm font-semibold mb-2">Сортировка</label>
              <select
                value={filters.sortBy || 'publishedAt'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SORT_OPTIONS.map((sort) => (
                  <option key={sort.value} value={sort.value}>
                    {sort.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


