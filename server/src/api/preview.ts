import express from 'express';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

const router = express.Router();

router.post('/preview', async (req: express.Request, res: express.Response) => {
  try {
    console.log('Preview request received:', req.body);
    
    const { url } = req.body;
    if (!url) {
      console.log('Error: URL is missing');
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log('Fetching URL:', url);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    console.log('Response status:', response.status);
    if (!response.ok) {
      console.error('Failed to fetch URL:', response.statusText);
      return res.status(response.status).json({ 
        error: `Failed to fetch URL: ${response.statusText}` 
      });
    }

    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);

    const html = await response.text();
    console.log('HTML length:', html.length);
    
    // Парсим HTML
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Получаем мета-данные с fallback значениями
    const title = document.querySelector('title')?.textContent || 
                 document.querySelector('meta[property="og:title"]')?.getAttribute('content') || 
                 new URL(url).hostname;
                 
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || 
                       document.querySelector('meta[property="og:description"]')?.getAttribute('content') || 
                       '';
                       
    const image = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || 
                 document.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || 
                 '';

    // Получаем домен из URL
    const domain = new URL(url).hostname;
    
    // Ищем favicon в разных местах
    const faviconLink = document.querySelector('link[rel="icon"]') || 
                       document.querySelector('link[rel="shortcut icon"]');
    
    let favicon = faviconLink?.getAttribute('href') || `/favicon.ico`;
    
    // Если favicon - относительный URL, делаем его абсолютным
    if (favicon.startsWith('/')) {
      favicon = `https://${domain}${favicon}`;
    } else if (!favicon.startsWith('http')) {
      favicon = `https://${domain}/${favicon}`;
    }

    const preview = {
      title,
      description,
      image,
      favicon,
      domain
    };

    console.log('Generated preview:', preview);
    res.json(preview);

  } catch (error) {
    console.error('Preview fetch failed:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ error: 'Failed to fetch preview' });
  }
});

export default router; 