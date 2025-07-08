import { useState, useEffect, useMemo } from 'react';
import {
  Resource,
  ResourcesBySection,
  ResourceWithSectionSlug,
} from '../types/resource';
import { CategoryId } from '../types/category';
import { ResourceSection } from '../pages/ResourcePage/config';
import {
  fetchSectionsWithResourcesAndCategories,
  fetchCategories,
} from '../services/supabase';

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

/**
 * Хук для получения ресурсов.
 *
 * - Если `section` не указан, возвращаем структуру вида:
 *     {
 *       [sectionId: string]: ResourceWithSectionSlug[]
 *     }
 *   (все секции и вложенные в них approved‐ресурсы, сгруппированные по sectionId).
 *
 * - Если `section` указан (slug секции), возвращаем простой массив `Resource[]`
 *   для заданной секции.
 */
export function useResources<T extends ResourceSection | undefined = undefined>(
  section?: T
): UseResourcesReturn<T> {
  // Для home: resources — объект ResourcesBySection ({} по умолчанию).
  // Для конкретной секции: resources — массив ResourceWithSectionSlug[] ([] по умолчанию).
  const [resources, setResources] = useState<
    ResourcesBySection | ResourceWithSectionSlug[]
  >(section ? [] : {});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Список всех категорий (для панели фильтров на home).
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Загружаем сразу все секции с вложенными ресурсами и категориями:
        const sectionsWithData = await fetchSectionsWithResourcesAndCategories();

        // 2. Одновременно можем загрузить общий список категорий (для фильтрации на home):
        const cats = await fetchCategories();
        setCategories(cats);

        // Если пользователь указал конкретную секцию (по slug) – показываем только её ресурсы.
        if (section) {
          // Найдём объект нужной секции по slug:
          const sectionObj = sectionsWithData.find(
            (s: any) => s.slug === section
          );

          if (!sectionObj) {
            // Если такого slug нет – возвращаем ошибку
            setResources([]);
            setError('Секция не найдена');
            setLoading(false);
            return;
          }

          // В sectionObj.resources уже лежит массив "approved" ресурсов с вложенными resource_categories → categories.
          // Преобразуем каждый ресурс в нужный формат ResourceWithSectionSlug:
          const sectionResources: ResourceWithSectionSlug[] =
            sectionObj.resources.map((r: any) => {
              // r.resource_categories: [{ category_id, categories: { id, label, color } }, …]
              // Для удобства мы выпишем массив category_id:
              const categoryIds: CategoryId[] = r.resource_categories.map(
                (rc: any) => rc.category_id
              );

              return {
                id: r.id,
                url: r.url,
                section_id: sectionObj.id,
                section: sectionObj.label,
                section_slug: sectionObj.slug,
                description: r.description || '',
                createdAt: r.created_at,
                approvedAt: r.approved_at,
                categories: categoryIds,
                title: r.title || '',
                descriptionFull: r.preview_description || '',
                image: r.preview_image || '',
                favicon: r.favicon || r.preview_favicon || '',
                domain: r.domain || r.preview_domain || '',
              };
            });

          setResources(sectionResources);
        } else {
          // Home (главная): группируем по section_id
          const grouped: ResourcesBySection = {};

          // У нас теперь sectionsWithData = [ { id, label, slug, resources: [ … ] }, … ]
          for (const sec of sectionsWithData) {
            if (!sec.resources || sec.resources.length === 0) {
              // Если в секции нет approved ресурсов, можно пропустить или положить пустой массив:
              continue;
            }

            // Преобразуем каждый ресурс в ResourceWithSectionSlug
            const mappedResources: ResourceWithSectionSlug[] =
              sec.resources.map((r: any) => {
                const categoryIds: CategoryId[] = r.resource_categories.map(
                  (rc: any) => rc.category_id
                );

                return {
                  id: r.id,
                  url: r.url,
                  section_id: sec.id,
                  section: sec.label,
                  section_slug: sec.slug,
                  description: r.description || '',
                  createdAt: r.created_at,
                  approvedAt: r.approved_at,
                  categories: categoryIds,
                  title: r.title || '',
                  descriptionFull: r.preview_description || '',
                  image: r.preview_image || '',
                  favicon: r.favicon || r.preview_favicon || '',
                  domain: r.domain || r.preview_domain || '',
                };
              });

            // Ключем для grouped используем именно numeric ID секции (как раньше).
            grouped[sec.id] = mappedResources;
          }

          setResources(grouped);
        }

        setError('');
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Не удалось загрузить ресурсы');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [section]);

  /**
   * Фильтрация по выбранным категориям:
   * Если мы на home и выбраны какие-то категории → фильтруем grouped‐объект,
   * оставляя только ресурсы, у которых есть хотя бы одна выбранная категория.
   */
  const filteredResources = useMemo(() => {
    if (!section && selectedCategories.length > 0) {
      const grouped = resources as ResourcesBySection;
      return Object.fromEntries(
        Object.entries(grouped).map(([secId, items]) => [
          secId,
          items.filter((item) =>
            item.categories?.some((cat) => selectedCategories.includes(cat))
          ),
        ])
      );
    }
    return resources;
  }, [resources, selectedCategories, section]);

  // Возвращаем результат, тип возвращаемого значения зависит от того, указана ли секция:
  return (section
    ? {
        resources: resources as Resource[],
        loading,
        error,
      }
    : {
        loading,
        error,
        selectedCategories,
        setSelectedCategories,
        filteredResources: filteredResources as ResourcesBySection,
        categories,
      }) as UseResourcesReturn<T>;
}
