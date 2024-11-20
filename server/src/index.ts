import express from 'express';
import cors from 'cors';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { PreviewData } from './types/preview';
import { db, queries } from './db';
import { searchController } from './controllers/search';

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

// Добавляем интерфейс для строки с разделом
interface SectionRow {
  section: string;
}

const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Тестовый эндпоинт
app.get('/api/test', (_req, res) => {
  res.json({ message: 'API is working' });
});

app.get('/', (_req, res) => {
  res.json({
    message: 'API is running',
    endpoints: {
      suggestions: {
        getAll: 'GET /api/suggestions/all',
        getApproved: 'GET /api/suggestions',
        create: 'POST /api/suggestions',
        updateStatus: 'PUT /api/suggestions/:id/status'
      },
      preview: {
        get: 'POST /api/preview'
      }
    }
  });
});

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

    // Обаботка относительных URL для изображений
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

app.get('/api/suggestions', searchController(db));

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

// Эндпоинт для бновления статуса предложения
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

// Эндпоинт для обновления материала
app.put('/api/suggestions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { section, description, preview } = req.body;

    // Обновляем запись
    const result = queries.update.run({
      id: Number(id),
      section,
      description,
      preview_title: preview.title,
      preview_domain: preview.domain
    });

    // Проверяем, была ли обновлена запись
    if (result.changes === 0) {
      return res.status(404).json({ 
        error: 'Материал не найден' 
      });
    }

    // Получаем обновленную запись
    const updatedRow = queries.getById.get({ id: Number(id) }) as SuggestionRow;
    
    // Форматируем ответ
    const updatedSuggestion = {
      id: updatedRow.id,
      url: updatedRow.url,
      section: updatedRow.section,
      description: updatedRow.description,
      preview: {
        title: updatedRow.preview_title,
        description: updatedRow.preview_description,
        image: updatedRow.preview_image,
        favicon: updatedRow.preview_favicon,
        domain: updatedRow.preview_domain
      },
      status: updatedRow.status,
      createdAt: updatedRow.created_at
    };

    res.json(updatedSuggestion);

  } catch (error) {
    console.error('Error updating suggestion:', error);
    res.status(500).json({ 
      error: 'Failed to update suggestion',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Эндпоинт для удаления материала
app.delete('/api/suggestions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Удаляе запись
    const result = queries.delete.run({
      id: Number(id)
    });

    // Проверяем, была ли удалена запись
    if (result.changes === 0) {
      return res.status(404).json({ 
        error: 'Материал не найден' 
      });
    }

    res.json({ 
      message: 'Материал успешно удален',
      id: Number(id)
    });

  } catch (error) {
    console.error('Error deleting suggestion:', error);
    res.status(500).json({ 
      error: 'Failed to delete suggestion',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Эндпоинт для получения списка разделов
app.get('/api/sections', (_req, res) => {
  try {
    console.log('Fetching sections...');
    
    const query = db.prepare(`
      SELECT DISTINCT section 
      FROM suggestions 
      WHERE status = 'approved'
    `);
    
    // Добавляем явное приведение типов
    const rows = query.all() as SectionRow[];
    const sections = rows.map(row => row.section);
    
    console.log('Found sections:', sections);
    res.json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({ 
      error: 'Failed to fetch sections' 
    });
  }
});

// Отладочный запрос для проверки данных в базе
const debugQuery = db.prepare(`
  SELECT preview_title, lower(preview_title) as lower_title 
  FROM suggestions 
  WHERE status = 'approved'
`).all();
console.log('Debug - all titles:', debugQuery);

const encodingCheck = db.prepare('PRAGMA encoding').get();
console.log('Database encoding:', encodingCheck);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 