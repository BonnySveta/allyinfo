import express from 'express';
import { queries, updateSuggestion, deleteSuggestion } from '../db';

const router = express.Router();

// Существующие маршруты

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

export default router; 