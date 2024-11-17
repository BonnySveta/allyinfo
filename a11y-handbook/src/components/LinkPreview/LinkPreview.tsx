import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchPreview } from '../../api/preview';
import { PreviewData } from '../../types/preview';
import { usePreviewCache } from '../../hooks/usePreviewCache';

interface LinkPreviewProps {
  url: string;
}

export function LinkPreview({ url }: LinkPreviewProps) {
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [error, setError] = useState('');
  const previewCache = usePreviewCache();

  useEffect(() => {
    if (!url) return;

    let timeoutId: NodeJS.Timeout;
    let isMounted = true;

    const getPreview = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Сначала проверяем кэш
        const cachedData = previewCache.get(url);
        if (cachedData) {
          console.log('Using cached preview data for:', url);
          setPreviewData(cachedData);
          setLoading(false);
          return;
        }

        console.log('Fetching fresh preview data for:', url);
        const data = await fetchPreview(url);
        
        if (isMounted) {
          setPreviewData(data);
          // Сохраняем в кэш
          previewCache.set(url, data);
        }
      } catch (err) {
        console.error('Preview error:', err);
        if (isMounted) {
          setError('Не удалось загрузить предпросмотр');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Добавляем небольшую задержку перед запросом
    timeoutId = setTimeout(getPreview, 500);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [url]);

  if (loading) {
    return (
      <PreviewContainer>
        <LoadingSpinner>Загрузка...</LoadingSpinner>
      </PreviewContainer>
    );
  }

  if (error) {
    return (
      <PreviewContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </PreviewContainer>
    );
  }

  if (!previewData) return null;

  return (
    <PreviewContainer>
      {previewData.image && (
        <PreviewImage 
          src={previewData.image} 
          alt=""
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      <PreviewContent>
        <PreviewTitle>{previewData.title}</PreviewTitle>
        {previewData.description && (
          <PreviewDescription>{previewData.description}</PreviewDescription>
        )}
        <PreviewMeta>
          {previewData.favicon && (
            <SiteFavicon 
              src={previewData.favicon} 
              alt=""
              onError={(e) => e.currentTarget.style.display = 'none'}
            />
          )}
          <SiteDomain>{previewData.domain}</SiteDomain>
        </PreviewMeta>
      </PreviewContent>
    </PreviewContainer>
  );
}

// Стили
const PreviewContainer = styled.div`
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  margin-top: 8px;
  background: var(--background-color);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid var(--border-color);
`;

const PreviewContent = styled.div`
  padding: 16px;
`;

const PreviewTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 16px;
  color: var(--text-color);
`;

const PreviewDescription = styled.p`
  margin: 0 0 12px;
  font-size: 14px;
  color: var(--text-secondary-color);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PreviewMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SiteFavicon = styled.img`
  width: 16px;
  height: 16px;
`;

const SiteDomain = styled.span`
  font-size: 14px;
  color: var(--text-secondary-color);
`;

const LoadingSpinner = styled.div`
  padding: 16px;
  text-align: center;
  color: var(--text-secondary-color);
`;

const ErrorMessage = styled.div`
  padding: 16px;
  color: var(--error-color);
  text-align: center;
`;