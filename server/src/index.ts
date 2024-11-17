import express from 'express';
import cors from 'cors';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { PreviewData } from './types/preview';
import { db, queries } from './db';

// Добавляем интерфейс для данных из БД
interface SuggestionRow {
  id: number;
  url: string;
  section: string;
  description: string | null;
  preview_title: string;
  preview_description: string;
  preview_image: string | null;
  preview_favicon: string;
  preview_domain: string;
  status: string;
  created_at: string;
}

const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
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

app.post('/api/suggestions', async (req, res) => {
  try {
    const { url, section, description } = req.body;

    // Получаем превью используя существующую логику
    const preview = await fetch(`http://localhost:${port}/api/preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    }).then(res => res.json());

    if (preview.error) {
      throw new Error(preview.error);
    }

    // Сохраняем в БД
    const result = queries.insert.run({
      url,
      section,
      description,
      preview_title: preview.title,
      preview_description: preview.description,
      preview_image: preview.image,
      preview_favicon: preview.favicon,
      preview_domain: preview.domain,
      status: 'pending'
    });

    res.status(201).json({
      id: result.lastInsertRowid,
      url,
      section,
      description,
      preview,
      status: 'pending'
    });

  } catch (error) {
    console.error('Error saving suggestion:', error);
    res.status(500).json({ 
      error: 'Failed to save suggestion',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/suggestions', (req, res) => {
  try {
    const rows = queries.getApproved.all() as SuggestionRow[];
    
    const suggestions = rows.map(row => ({
      id: row.id,
      url: row.url,
      section: row.section,
      description: row.description,
      preview: {
        title: row.preview_title,
        description: row.preview_description,
        image: row.preview_image,
        favicon: row.preview_favicon,
        domain: row.preview_domain
      },
      status: row.status,
      createdAt: row.created_at
    }));

    res.json(suggestions);

  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch suggestions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Эндпоинт для просмотра всех предложений
app.get('/api/suggestions/all', (_req, res) => {
  try {
    console.log('Fetching all suggestions...');
    const suggestions = queries.getAll.all();
    console.log('Found suggestions:', suggestions);
    
    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch suggestions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Эндпоинт для обновления статуса предложения
app.put('/api/suggestions/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Проверяем валидность статуса
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be either "approved" or "rejected"' 
      });
    }

    // Обновляем статус
    const result = queries.updateStatus.run({
      id: Number(id),
      status
    });

    // Проверяем, была ли обновлена запись
    if (result.changes === 0) {
      return res.status(404).json({ 
        error: 'Suggestion not found' 
      });
    }

    // Получаем все записи и находим обновленную
    const suggestions = queries.getAll.all();
    const updatedSuggestion = suggestions.find(
      (s: any) => s.id === Number(id)
    );

    if (!updatedSuggestion) {
      return res.status(404).json({ 
        error: 'Updated suggestion not found' 
      });
    }

    res.json(updatedSuggestion);

  } catch (error) {
    console.error('Error updating suggestion status:', error);
    res.status(500).json({ 
      error: 'Failed to update suggestion status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 