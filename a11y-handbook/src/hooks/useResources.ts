import { useState, useEffect } from 'react';
import { Resource } from '../types/resource';
import { ResourceSection } from '../pages/ResourcePage/config';

interface UseResourcesResult {
  resources: Resource[];
  loading: boolean;
  error: string | null;
}

export function useResources(section: ResourceSection): UseResourcesResult {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/suggestions/all');
        
        if (!response.ok) {
          throw new Error('Failed to fetch resources');
        }

        const data = await response.json();
        
        const filteredData = data.filter((item: any) => 
          item.section.replace(/^\//, '') === section && 
          item.status === 'approved'
        );

        console.log('Filtered data:', filteredData);

        const transformedData = filteredData.map((item: any) => ({
          id: item.id,
          url: item.url,
          section: item.section,
          description: item.description,
          createdAt: item.created_at,
          preview: {
            title: item.preview_title || '',
            description: item.preview_description || '',
            image: item.preview_image || '',
            favicon: item.preview_favicon || '',
            domain: item.preview_domain || ''
          }
        }));

        setResources(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Не удалось загрузить материалы');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [section]);

  return { resources, loading, error };
} 