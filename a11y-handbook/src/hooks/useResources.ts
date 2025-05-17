import { useState, useEffect, useMemo } from 'react';
import { Resource, ResourcesBySection } from '../types/resource';
import { CategoryId } from '../types/category';
import { ResourceSection } from '../pages/ResourcePage/config';
import { fetchSuggestions, fetchCategories } from '../services/supabase';

interface UseResourcesBaseResult {
  loading: boolean;
  error: string;
}

export interface UseResourcesHomeResult extends UseResourcesBaseResult {
  selectedCategories: CategoryId[];
  setSelectedCategories: (categories: CategoryId[]) => void;
  filteredResources: ResourcesBySection;
}

export interface UseResourcesSectionResult extends UseResourcesBaseResult {
  resources: Resource[];
}

type UseResourcesReturn<T> = T extends ResourceSection 
  ? UseResourcesSectionResult 
  : UseResourcesHomeResult;

export function useResources<T extends ResourceSection | undefined = undefined>(
  section?: T
): UseResourcesReturn<T> {
  const [resources, setResources] = useState<ResourcesBySection | Resource[]>(section ? [] : {});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Получаем все материалы со статусом approved
        const suggestions = await fetchSuggestions('approved');
        // Получаем все категории (для сопоставления)
        const categories = await fetchCategories();

        // Преобразуем данные в нужный формат
        if (section) {
          // Для страницы конкретной секции
          const sectionResources = suggestions
            .filter((item: any) => item.section.replace('/', '') === section)
            .map((item: any) => ({
              id: item.id,
              url: item.url,
              section: item.section.replace('/', ''),
              description: item.description || '',
              createdAt: item.created_at,
              categories: item.categories || [],
              preview: {
                title: item.preview_title || '',
                description: item.preview_description || '',
                image: item.preview_image || '',
                favicon: item.preview_favicon || '',
                domain: item.preview_domain || ''
              }
            }));
          setResources(sectionResources);
        } else {
          // Для главной страницы: группируем по секциям
          const grouped = suggestions.reduce((acc: ResourcesBySection, item: any) => {
            const sectionKey = item.section.replace('/', '');
            if (!acc[sectionKey]) {
              acc[sectionKey] = [];
            }
            acc[sectionKey].push({
              id: item.id,
              url: item.url,
              section: sectionKey,
              description: item.description || '',
              createdAt: item.created_at,
              categories: item.categories || [],
              preview: {
                title: item.preview_title || '',
                description: item.preview_description || '',
                image: item.preview_image || '',
                favicon: item.preview_favicon || '',
                domain: item.preview_domain || ''
              }
            });
            return acc;
          }, {});
          setResources(grouped);
        }
        setError('');
      } catch (error) {
        console.error('Error fetching resources:', error);
        setError('Не удалось загрузить ресурсы');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [section]);

  const filteredResources = useMemo(() => {
    if (!section && selectedCategories.length > 0) {
      const grouped = resources as ResourcesBySection;
      return Object.fromEntries(
        Object.entries(grouped).map(([section, items]) => [
          section,
          items.filter(item => 
            item.categories?.some(cat => selectedCategories.includes(cat))
          )
        ])
      );
    }
    return resources;
  }, [resources, selectedCategories, section]);

  return (section ? {
    resources: resources as Resource[],
    loading,
    error
  } : {
    loading,
    error,
    selectedCategories,
    setSelectedCategories,
    filteredResources: filteredResources as ResourcesBySection
  }) as UseResourcesReturn<T>;
} 