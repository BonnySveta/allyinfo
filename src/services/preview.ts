import { google } from 'googleapis';
import cheerio from 'cheerio';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY // Нужно добавить API ключ в .env
});

async function getYoutubePreview(url: string) {
  try {
    // Извлекаем ID видео из URL
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/videos\/))([^&\n?#\s]*)/)?.[1];
    
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    // Получаем информацию о видео через API
    const response = await youtube.videos.list({
      part: ['snippet'],
      id: [videoId]
    });

    const video = response.data.items?.[0];
    if (!video) {
      throw new Error('Video not found');
    }

    return {
      title: video.snippet?.title || '',
      description: video.snippet?.description || '',
      image: video.snippet?.thumbnails?.default?.url || null,
      favicon: 'https://www.youtube.com/favicon.ico',
      domain: 'youtube.com'
    };
  } catch (error) {
    console.error('Failed to fetch YouTube preview:', error);
    throw error;
  }
}

async function getPreview(url: string) {
  try {
    // Сначала пробуем прямой запрос
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('Direct request failed');
      
      const html = await response.text();
      return parseHtml(html, url);
    } catch (directError) {
      console.log('Direct request failed, trying proxy:', directError);
      
      // Если прямой запрос не удался, используем прокси
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const response = await fetch(proxyUrl + encodeURIComponent(url));
      
      if (!response.ok) throw new Error('Proxy request failed');
      
      const html = await response.text();
      return parseHtml(html, url);
    }
  } catch (error) {
    console.error('Error fetching preview:', error);
    return getFallbackPreview(url);
  }
}

// Выносим парсинг HTML в отдельную функцию
function parseHtml(html: string, url: string) {
  const $ = cheerio.load(html);
  
  const title = 
    $('meta[property="og:title"]').attr('content') || 
    $('meta[name="twitter:title"]').attr('content') || 
    $('title').text() ||
    new URL(url).hostname;
    
  return {
    title,
    description: $('meta[name="description"]').attr('content') || 
                $('meta[property="og:description"]').attr('content') || 
                $('meta[name="twitter:description"]').attr('content') || '',
    image: $('meta[property="og:image"]').attr('content') || 
           $('meta[name="twitter:image"]').attr('content') || null,
    favicon: $('link[rel="icon"]').attr('href') || 
            $('link[rel="shortcut icon"]').attr('href') || 
            '/favicon.ico',
    domain: new URL(url).hostname
  };
}

// Функция для получения базовой информации
function getFallbackPreview(url: string) {
  const domain = new URL(url).hostname;
  return {
    title: domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1),
    description: 'Описание недоступно',
    image: null,
    favicon: `https://${domain}/favicon.ico`,
    domain: domain
  };
} 