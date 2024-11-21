import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { fetchPreview } from '../../api/preview';
import { PreviewData } from '../../types/preview';
import { usePreviewCache } from '../../hooks/usePreviewCache';

// Анимации
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Стилизованные компоненты
const PreviewContainer = styled.div<{ $isLoading?: boolean }>`
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 12px;
  overflow: hidden;
  margin-top: 12px;
  background: var(--background-color, #ffffff);
  transition: all 0.2s ease;
  animation: ${fadeIn} 0.3s ease-out;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    border-radius: 8px;
    margin-top: 8px;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  background-color: var(--skeleton-color, #f5f5f5);

  @media (max-width: 768px) {
    height: 150px;
  }
`;

const PreviewContent = styled.div`
  padding: 16px;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const PreviewTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color, #1a1a1a);
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const PreviewDescription = styled.p`
  margin: 0 0 12px;
  font-size: 14px;
  color: var(--text-secondary-color, #666666);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 13px;
    margin-bottom: 8px;
  }
`;

const PreviewMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SiteFavicon = styled.img`
  width: 16px;
  height: 16px;
  border-radius: 3px;
  flex-shrink: 0;
`;

const SiteDomain = styled.span`
  font-size: 14px;
  color: var(--text-secondary-color, #666666);
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const LoadingContainer = styled.div`
  padding: 16px;
  background: linear-gradient(
    90deg,
    var(--skeleton-color, #f5f5f5) 25%,
    var(--skeleton-highlight, #efefef) 50%,
    var(--skeleton-color, #f5f5f5) 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
  height: 120px;
`;

const ErrorContainer = styled.div`
  padding: 16px;
  color: var(--error-color, #dc3545);
  text-align: center;
  border: 1px solid var(--error-border-color, #f5c2c7);
  border-radius: 8px;
  background-color: var(--error-background, #f8d7da);
`;

// Компонент
interface LinkPreviewProps {
  url: string;
  onLoad?: (data: PreviewData) => void;
}

export function LinkPreview({ url, onLoad }: LinkPreviewProps) {
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
        const cachedData = previewCache.get(url);
        if (cachedData) {
          setPreviewData(cachedData);
          onLoad?.(cachedData);
          setLoading(false);
          return;
        }

        const data = await fetchPreview(url);
        if (isMounted) {
          setPreviewData(data);
          previewCache.set(url, data);
          onLoad?.(data);
        }
      } catch (err) {
        if (isMounted) {
          setError('Не удалось загрузить предпросмотр');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    timeoutId = setTimeout(getPreview, 500);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [url, onLoad]);

  if (loading) {
    return <LoadingContainer aria-label="Загрузка предпросмотра..." />;
  }

  if (error) {
    return <ErrorContainer role="alert">{error}</ErrorContainer>;
  }

  if (!previewData) return null;

  return (
    <PreviewContainer>
      {previewData.image && (
        <PreviewImage 
          src={previewData.image} 
          alt=""
          onError={(e) => {
            console.log('Failed to load preview image:', previewData.image);
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
              onError={(e) => {
                // Если не удалось загрузить фавикон, пробуем загрузить стандартный favicon.ico
                const target = e.target as HTMLImageElement;
                if (!target.src.endsWith('/favicon.ico')) {
                  target.src = `https://${previewData.domain}/favicon.ico`;
                } else {
                  // Если и стандартный favicon.ico не загрузился, скрываем элемент
                  target.style.display = 'none';
                }
              }}
            />
          )}
          <SiteDomain>{previewData.domain}</SiteDomain>
        </PreviewMeta>
      </PreviewContent>
    </PreviewContainer>
  );
}