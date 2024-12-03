import express from 'express';
import { queries, updateSuggestion, deleteSuggestion, db } from '../db';
import { searchController } from '../controllers/search';
import fetch from 'node-fetch';

// Добавляем интерфейс для ответа превью
interface PreviewResponse {
  title: string;
  description: string;
  image: string;
  favicon: string;
  domain: string;
  error?: string;
}

// Добавляем интерфейс для ответа YouTube
interface YouTubePreviewResponse {
  title?: string;
  description?: string;
  image?: string;
  error?: string;
}

const router = express.Router();

// Получение всех предложений
router.get('/suggestions/all', (_req, res) => {
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

// Поиск предложений
router.get('/suggestions', async (req, res) => {
  try {
    console.log('Getting suggestions with params:', req.query);
    const { limit = 100, page = 1 } = req.query;
    
    const offset = (Number(page) - 1) * Number(limit);
    
    // Проверяем подключение к БД
    if (!db) {
      throw new Error('Database connection not established');
    }

    console.log('Executing count query...');
    const query = db.prepare(`
      SELECT COUNT(*) as total FROM suggestions
      WHERE status = 'approved'
    `);
    
    const total = query.get() as { total: number };
    console.log('Total approved suggestions:', total);

    console.log('Executing select query...');
    const suggestions = db.prepare(`
      SELECT * FROM suggestions
      WHERE status = 'approved'
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(Number(limit), offset);

    console.log(`Found ${suggestions.length} suggestions`);
    
    const response = {
      items: suggestions,
      total: total.total,
      page: Number(page),
      limit: Number(limit)
    };

    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({ 
      error: 'Failed to get suggestions',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Создание нового предложения
router.post('/suggestions', async (req, res) => {
  try {
    const { url, section, description } = req.body;

    let preview: PreviewResponse;
    
    // Проверяем, является ли это YouTube ссылкой или выбран раздел YouTube
    const isYouTube = section === '/youtube' || url.includes('youtu.be') || url.includes('youtube.com');
    
    if (isYouTube) {
      // Пытаемся получить данные с YouTube
      try {
        const response = await fetch(`http://localhost:3001/api/preview`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url })
        });

        const youtubeData = await response.json() as YouTubePreviewResponse;

        preview = {
          title: youtubeData.title || 'YouTube видео',
          description: youtubeData.description || description || '',
          image: youtubeData.image || `https://i.ytimg.com/vi/${url.split('/').pop()}/maxresdefault.jpg`,
          favicon: 'https://www.youtube.com/favicon.ico',
          domain: 'youtube.com'
        };
      } catch (error) {
        // Если не удалось получить данные, используем базовые
        preview = {
          title: 'YouTube видео',
          description: description || '',
          image: `https://i.ytimg.com/vi/${url.split('/').pop()}/maxresdefault.jpg`,
          favicon: 'https://www.youtube.com/favicon.ico',
          domain: 'youtube.com'
        };
      }
    } else {
      // Для остальных ссылок получаем превью как обычно
      const response = await fetch(`http://localhost:3001/api/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });

      preview = await response.json() as PreviewResponse;

      if (preview.error) {
        throw new Error(preview.error);
      }
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

// Обновление статуса предложения
router.put('/suggestions/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be either "approved" or "rejected"' 
      });
    }

    const result = queries.updateStatus.run({
      id: Number(id),
      status
    });

    if (result.changes === 0) {
      return res.status(404).json({ 
        error: 'Suggestion not found' 
      });
    }

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

// Обновление материала
router.put('/suggestions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const result = updateSuggestion(Number(id), updateData);
    
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Запись не найдена' });
    }

    // Получаем обновленную запись
    const updated = queries.getById.get({ id: Number(id) });
    res.json(updated);
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ 
      message: error instanceof Error ? error.message : 'Ошибка при обновлении записи' 
    });
  }
});

// Удаление материала
router.delete('/suggestions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = deleteSuggestion(Number(id));
    
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Запись не найдена' });
    }

    res.json({ message: 'Запись успешно удалена' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(400).json({ 
      message: error instanceof Error ? error.message : 'Ошибка при удалении записи' 
    });
  }
});

// Получение списка разделов
router.get('/sections', (_req, res) => {
  try {
    console.log('Fetching sections...');
    
    const query = db.prepare(`
      SELECT DISTINCT section 
      FROM suggestions 
      WHERE status = 'approved'
    `);
    
    const rows = query.all() as { section: string }[];
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

export default router; 