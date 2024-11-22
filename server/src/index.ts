import express from 'express';
import cors from 'cors';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { PreviewData } from './types/preview';
import { db } from './db';
import suggestionsRouter from './api/suggestions';
import feedbackRouter from './api/feedback';

const app = express();
export const PORT = 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Подключаем роутеры
app.use('/api', suggestionsRouter);
app.use('/api', feedbackRouter);

// Описание API
app.get('/', (_req, res) => {
  res.json({
    message: 'API is running',
    endpoints: {
      suggestions: {
        getAll: 'GET /api/suggestions/all',
        getApproved: 'GET /api/suggestions',
        create: 'POST /api/suggestions',
        updateStatus: 'PUT /api/suggestions/:id/status',
        update: 'PUT /api/suggestions/:id',
        delete: 'DELETE /api/suggestions/:id'
      },
      feedback: {
        getAll: 'GET /api/feedback',
        create: 'POST /api/feedback',
        updateStatus: 'PUT /api/feedback/:id',
        delete: 'DELETE /api/feedback/:id'
      },
      preview: {
        get: 'POST /api/preview'
      }
    }
  });
});

// Preview endpoint
app.post('/api/preview', async (req, res) => {
  console.log('1. Starting preview request for:', req.body.url);
  
  try {
    const { url } = req.body;
    
    if (!url) {
      console.log('2. Error: URL is empty');
      return res.status(400).json({ error: 'URL обязателен для заполнения' });
    }

    try {
      new URL(url);
      console.log('3. URL is valid:', url);
    } catch (e) {
      console.log('3. Error: Invalid URL format');
      return res.status(400).json({ error: 'Неверный формат URL' });
    }

    console.log('4. Fetching URL...');
    const response = await fetch(url, { 
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });

    console.log('5. Response status:', response.status);
    if (!response.ok) {
      console.log('5a. Error: Response not OK');
      return res.status(response.status).json({ 
        error: `Failed to fetch URL: ${response.statusText}` 
      });
    }

    const contentType = response.headers.get('content-type');
    console.log('6. Content-Type:', contentType);

    if (!contentType || !contentType.includes('text/html')) {
      console.log('6a. Error: Not HTML content');
      return res.status(400).json({ error: 'URL must point to an HTML page' });
    }

    const html = await response.text();
    console.log('7. Received HTML length:', html.length);

    const $ = cheerio.load(html);
    const domain = new URL(url).hostname;
    console.log('8. Parsed domain:', domain);

    const preview: PreviewData = {
      title: $('meta[property="og:title"]').attr('content') || 
             $('title').text() || 
             domain,
             
      description: $('meta[property="og:description"]').attr('content') || 
                  $('meta[name="description"]').attr('content') || 
                  '',
                  
      image: $('meta[property="og:image"]').attr('content') || 
             $('meta[name="twitter:image"]').attr('content') || 
             $('link[rel="image_src"]').attr('href') || 
             '',
             
      favicon: $('link[rel="icon"]').attr('href') || 
              $('link[rel="shortcut icon"]').attr('href') || 
              '/favicon.ico',
              
      siteName: $('meta[property="og:site_name"]').attr('content') || 
                domain,
                
      url: url,
      domain: domain,
      
      twitterCard: {
        card: $('meta[name="twitter:card"]').attr('content') || 'summary',
        site: $('meta[name="twitter:site"]').attr('content'),
        creator: $('meta[name="twitter:creator"]').attr('content')
      },
      
      og: {
        type: $('meta[property="og:type"]').attr('content'),
        site_name: $('meta[property="og:site_name"]').attr('content'),
        locale: $('meta[property="og:locale"]').attr('content')
      }
    };

    console.log('9. Generated preview:', preview);

    // Обработка относительных URL
    if (preview.image && preview.image.startsWith('/')) {
      preview.image = new URL(preview.image, url).toString();
      console.log('10. Fixed relative image URL:', preview.image);
    }
    if (preview.favicon && preview.favicon.startsWith('/')) {
      preview.favicon = new URL(preview.favicon, url).toString();
      console.log('11. Fixed relative favicon URL:', preview.favicon);
    }

    console.log('12. Sending preview response');
    res.json(preview);

  } catch (error) {
    console.error('13. Error in preview generation:', error);
    res.status(500).json({ 
      error: 'Failed to fetch preview',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}); 

// Проверка кодировки базы данных
const encodingCheck = db.prepare('PRAGMA encoding').get();
console.log('Database encoding:', encodingCheck);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 