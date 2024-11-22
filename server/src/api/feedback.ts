import express from 'express';
import { queries, addFeedback } from '../db';

const router = express.Router();

// Получение всех сообщений обратной связи
router.get('/feedback', async (req, res) => {
  try {
    const feedback = queries.getAllFeedback.all();
    res.json(feedback);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(400).json({ 
      message: error instanceof Error ? error.message : 'Ошибка при получении сообщений' 
    });
  }
});

// Добавление нового сообщения
router.post('/feedback', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ message: 'Сообщение обязательно для заполнения' });
    }

    const result = addFeedback(message.trim());
    
    if (result.changes === 0) {
      throw new Error('Не удалось сохранить сообщение');
    }

    const newFeedback = {
      id: result.lastInsertRowid,
      message: message.trim(),
      status: 'new',
      created_at: new Date().toISOString()
    };

    res.status(201).json(newFeedback);

  } catch (error) {
    console.error('Save feedback error:', error);
    res.status(400).json({ 
      message: error instanceof Error ? error.message : 'Ошибка при сохранении сообщения' 
    });
  }
});

// Обновление статуса сообщения
router.put('/feedback/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = queries.updateFeedbackStatus.run({ 
      id: Number(id), 
      status 
    });
    
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Сообщение не найдено' });
    }

    const updated = queries.getFeedbackById.get({ id: Number(id) });
    res.json(updated);
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(400).json({ 
      message: error instanceof Error ? error.message : 'Ошибка при обновлении сообщения' 
    });
  }
});

export default router; 