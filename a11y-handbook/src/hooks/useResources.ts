import { useState, useEffect, useMemo } from 'react';
import { Resource, ResourcesBySection, ResourceWithSectionSlug } from '../types/resource';
import { CategoryId } from '../types/category';
import { ResourceSection } from '../pages/ResourcePage/config';
import { fetchSuggestions as fetchResources, fetchCategories, fetchSections, fetchResourceCategories } from '../services/supabase';

interface UseResourcesBaseResult {
  loading: boolean;
  error: string;
}

export interface UseResourcesHomeResult extends UseResourcesBaseResult {
  selectedCategories: CategoryId[];
  setSelectedCategories: (categories: CategoryId[]) => void;
  filteredResources: ResourcesBySection;
  categories: any[];
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
  const [resources, setResources] = useState<ResourcesBySection | ResourceWithSectionSlug[]>(section ? [] : {});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching resources for section:', section);
        
        // Получаем все материалы со статусом approved
        const resourcesRaw = await fetchResources('approved');
        console.log('Raw resources:', resourcesRaw);
        
        // Получаем все категории (для сопоставления)
        const cats = await fetchCategories();
        setCategories(cats);
        
        // Получаем все секции (для сопоставления)
        const sections = await fetchSections();
        console.log('Available sections:', sections);

        // Преобразуем данные в нужный формат
        if (section) {
          // Для страницы конкретной секции
          const sectionObj = sections.find((s: any) => s.slug === section);
          console.log('Found section object:', sectionObj);
          if (!sectionObj) {
            setResources([]);
            setError('Секция не найдена');
            setLoading(false);
            return;
          }
          const sectionId = sectionObj.id;
          const sectionResources = await Promise.all(
            resourcesRaw
              .filter((item: any) => item.section_id === sectionId)
              .map(async (item: any) => ({
                id: item.id,
                url: item.url,
                section_id: item.section_id,
                section: sectionObj?.label || '',
                section_slug: sectionObj?.slug || '',
                description: item.description || '',
                createdAt: item.created_at,
                categories: await fetchResourceCategories(item.id),
                title: item.title || '',
                descriptionFull: item.preview_description || '',
                image: item.preview_image || '',
                favicon: item.favicon || item.preview_favicon || '',
                domain: item.domain || item.preview_domain || ''
              }))
          );
          console.log('Filtered resources for section:', sectionResources);
          setResources(sectionResources as ResourceWithSectionSlug[]);
        } else {
          // Для главной страницы: группируем по section_id
          const grouped = {} as ResourcesBySection;
          for (const item of resourcesRaw) {
            const sectionKey = item.section_id;
            const sectionObj = sections.find((s: any) => s.id === sectionKey);
            const categories = await fetchResourceCategories(item.id);
            if (!grouped[sectionKey]) grouped[sectionKey] = [];
            grouped[sectionKey].push({
              id: item.id,
              url: item.url,
              section_id: sectionKey,
              section: sectionObj?.label || '',
              section_slug: sectionObj?.slug || '',
              description: item.description || '',
              createdAt: item.created_at,
              categories,
              title: item.title || '',
              descriptionFull: item.preview_description || '',
              image: item.preview_image || '',
              favicon: item.favicon || item.preview_favicon || '',
              domain: item.domain || item.preview_domain || ''
            } as ResourceWithSectionSlug);
          }
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
    filteredResources: filteredResources as ResourcesBySection,
    categories
  }) as UseResourcesReturn<T>;
} 