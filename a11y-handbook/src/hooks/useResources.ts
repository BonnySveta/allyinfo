import { useState, useEffect, useMemo } from 'react';
import { Resource, ResourcesBySection } from '../types/resource';
import { CategoryId } from '../types/category';
import { ResourceSection } from '../pages/ResourcePage/config';

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
    const fetchResources = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL; 
        const response = await fetch(`${apiUrl}/api/approved?limit=100&page=1&status=approved`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        if (section) {
          // Для страницы конкретной секции
          const sectionResources = data.items
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
          // Для главной страницы
          const grouped = data.items.reduce((acc: ResourcesBySection, item: any) => {
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

    fetchResources();
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