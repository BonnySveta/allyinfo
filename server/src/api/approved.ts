import express from 'express';
import { db } from '../db';

const router = express.Router();

interface Section {
  section: string;
}

interface TotalCount {
  total: number;
}

// Получение списка разделов
router.get('/sections', (req, res) => {
  try {
    const sections = db.prepare('SELECT DISTINCT section FROM suggestions WHERE status = "approved"').all() as Section[];
    res.json(sections.map(s => s.section));
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Получение списка одобренных материалов
router.get('/approved', (req, res) => {
  try {
    const { search, section, sortBy, order, page = '1', limit = '10' } = req.query;
    
    const pageNum = Number(page);
    const limitNum = Number(limit);
    
    let query = db.prepare(`
      SELECT * FROM suggestions 
      WHERE status = 'approved'
      ${search ? 'AND (preview_title LIKE ? OR preview_domain LIKE ?)' : ''}
      ${section ? 'AND section = ?' : ''}
      ORDER BY ${sortBy === 'title' ? 'preview_title' : sortBy === 'section' ? 'section' : 'created_at'} ${order === 'asc' ? 'ASC' : 'DESC'}
      LIMIT ? OFFSET ?
    `);

    const params = [
      ...(search ? [`%${search}%`, `%${search}%`] : []),
      ...(section ? [section] : []),
      limitNum,
      (pageNum - 1) * limitNum
    ];

    const items = query.all(params);
    
    const totalQuery = db.prepare(`
      SELECT COUNT(*) as total FROM suggestions 
      WHERE status = 'approved'
      ${search ? 'AND (preview_title LIKE ? OR preview_domain LIKE ?)' : ''}
      ${section ? 'AND section = ?' : ''}
    `);

    const result = totalQuery.get([
      ...(search ? [`%${search}%`, `%${search}%`] : []),
      ...(section ? [section] : [])
    ]) as TotalCount;

    res.json({
      items,
      pagination: {
        total: result.total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(result.total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching approved items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обновление одобренного материала
router.put('/approved/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { section, description, preview } = req.body;

    const result = db.prepare(`
      UPDATE suggestions 
      SET section = ?, description = ?, 
          preview_title = ?, preview_description = ?,
          preview_image = ?, preview_favicon = ?,
          preview_domain = ?
      WHERE id = ? AND status = 'approved'
    `).run(
      section,
      description,
      preview.title,
      preview.description,
      preview.image,
      preview.favicon,
      preview.domain,
      id
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Удаление одобренного материала
router.delete('/approved/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM suggestions WHERE id = ? AND status = "approved"').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 