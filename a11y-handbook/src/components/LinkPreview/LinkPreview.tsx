import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { fetchPreview } from '../../api/preview';
import { FaExclamationTriangle } from 'react-icons/fa';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PreviewContainer = styled.div`
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 1rem;
  margin-top: 0.5rem;
  background: var(--card-background);
  display: flex;
  gap: 1rem;
  align-items: start;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.3s ease;

  &:hover {
    border-color: var(--accent-color);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const PreviewImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 4px;
  object-fit: cover;
  background-color: var(--nav-background);
`;

const PreviewContent = styled.div`
  flex: 1;
`;

const PreviewTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: var(--text-color);
  font-weight: 500;
`;

const PreviewDescription = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary-color);
  line-height: 1.4;
`;

const LoadingPreview = styled.div`
  padding: 1rem;
  text-align: center;
  color: var(--text-secondary-color);
`;

const LoadingContainer = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--text-secondary-color);
  animation: ${fadeIn} 0.3s ease;
`;

const LoadingDot = styled.span`
  width: 8px;
  height: 8px;
  background-color: var(--accent-color);
  border-radius: 50%;
  animation: pulse 1s infinite;
  opacity: 0.6;

  &:nth-child(2) {
    animation-delay: 0.2s;
  }

  &:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--error-color);
  padding: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

const ErrorIcon = styled(FaExclamationTriangle)`
  font-size: 1rem;
`;

const PreviewUrl = styled.a`
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary-color);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

interface PreviewData {
  title: string;
  description: string;
  image: string;
  favicon?: string;
}

export function LinkPreview({ url }: { url: string }) {
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!url) return;

    console.log('LinkPreview: Starting preview fetch for URL:', url);
    
    let timeoutId: NodeJS.Timeout;
    let isMounted = true;

    const getPreview = async () => {
      setLoading(true);
      setError('');
      
      try {
        console.log('LinkPreview: Calling fetchPreview...');
        const data = await fetchPreview(url);
        console.log('LinkPreview: Preview data received:', data);
        if (isMounted) {
          setPreviewData(data);
        }
      } catch (err) {
        console.error('LinkPreview: Error fetching preview:', err);
        if (isMounted) {
          setError('Не удалось загрузить предпросмотр');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    console.log('LinkPreview: Setting up timeout...');
    timeoutId = setTimeout(getPreview, 500);

    return () => {
      console.log('LinkPreview: Cleanup effect...');
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [url]);

  if (!url) return null;
  
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingDot />
        <LoadingDot />
        <LoadingDot />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorIcon />
        {error}
      </ErrorContainer>
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
            // Если изображение не загрузилось, скрываем его
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
      <PreviewContent>
        <PreviewTitle>{previewData.title}</PreviewTitle>
        <PreviewDescription>{previewData.description}</PreviewDescription>
        <PreviewUrl>{new URL(url).hostname}</PreviewUrl>
      </PreviewContent>
    </PreviewContainer>
  );
} 