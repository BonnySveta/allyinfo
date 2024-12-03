import styled from 'styled-components';
import { SuggestForm } from '../../components/SuggestForm/SuggestForm';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const Title = styled.h1`
  color: var(--text-color);
  margin-bottom: 2rem;
`;

export function Suggest() {
  const getPreview = async (url: string, section: string) => {
    // Добавляем логи для отладки
    console.log('getPreview called with:', { url, section });
    
    // Проверяем, является ли это YouTube ссылкой или выбран раздел YouTube
    const isYouTube = section.toLowerCase() === 'youtube' || 
                      section === '/youtube' || 
                      url.includes('youtu.be') || 
                      url.includes('youtube.com');
    
    console.log('isYouTube check:', {
      sectionLower: section.toLowerCase(),
      sectionEquals: section.toLowerCase() === 'youtube',
      pathEquals: section === '/youtube',
      hasYouTuBe: url.includes('youtu.be'),
      hasYouTubeCom: url.includes('youtube.com'),
      finalResult: isYouTube
    });
    
    if (isYouTube) {
      console.log('Returning YouTube preview data');
      // Для YouTube не загружаем превью
      return {
        title: 'YouTube видео',
        description: '',
        image: '',
        favicon: 'https://www.youtube.com/favicon.ico',
        domain: 'youtube.com'
      };
    }

    console.log('Fetching preview for non-YouTube URL');
    // Для остальных ссылок получаем превью как обычно
    const response = await fetch('/api/preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      console.error('Preview fetch failed:', response.status, response.statusText);
      throw new Error('Не удалось загрузить предпросмотр');
    }

    const data = await response.json();
    console.log('Preview data received:', data);
    return data;
  };

  return (
    <PageContainer>
      <Title>Предложить материал</Title>
      <SuggestForm getPreview={getPreview} />
    </PageContainer>
  );
}