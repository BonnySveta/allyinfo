import express from 'express';
import cors from 'cors';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { PreviewData } from './types/preview';

const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['POST', 'GET', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

app.post('/api/preview', async (req, res) => {
  console.log('Received preview request for:', req.body.url);
  
  try {
    const { url } = req.body;
    
    // Проверка наличия URL
    if (!url) {
      return res.status(400).json({ 
        error: 'URL is required' 
      });
    }

    // Проверка валидности URL
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ 
        error: 'Invalid URL format' 
      });
    }

    // Запрос страницы
    const response = await fetch(url, { 
      timeout: 5000 
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Failed to fetch URL: ${response.statusText}` 
      });
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
      return res.status(400).json({ 
        error: 'URL must point to an HTML page' 
      });
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    const domain = new URL(url).hostname;

    const preview: PreviewData = {
      title: $('meta[property="og:title"]').attr('content') || 
             $('title').text() || 
             '',
             
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

    // Обработка относительных URL для изображений
    if (preview.image && preview.image.startsWith('/')) {
      preview.image = new URL(preview.image, url).toString();
    }
    if (preview.favicon && preview.favicon.startsWith('/')) {
      preview.favicon = new URL(preview.favicon, url).toString();
    }

    res.json(preview);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch preview',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(port, () => {
  console.log(`Preview server running on port ${port}`);
}); 