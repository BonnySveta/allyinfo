import express from 'express';
import { queries, updateSuggestion, deleteSuggestion, db } from '../db';
import { searchController } from '../controllers/search';
import fetch from 'node-fetch';

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
router.get('/suggestions', searchController(db));

// Создание нового предложения
router.post('/suggestions', async (req, res) => {
  try {
    const { url, section, description } = req.body;

    // Получаем превью
    const preview = await fetch(`http://localhost:3001/api/preview`, {
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