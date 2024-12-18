import express from 'express';
import { db } from '../db';

const router = express.Router();

interface Section {
  section: string;
}

interface TotalCount {
  total: number;
}

interface DBItem {
  id: number;
  section: string;
  description: string | null;
  preview_title: string;
  preview_description: string | null;
  preview_image: string | null;
  preview_favicon: string;
  preview_domain: string;
  status: string;
  created_at: string;
}

interface CategoryRow {
  category_id: string;
}

interface ItemWithCategories extends DBItem {
  categories: string[];
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
router.get('/', (req, res) => {
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

    const items = query.all(params) as DBItem[];
    
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

    // Получаем категории для каждого материала
    const itemsWithCategories = items.map(item => {
      const categoryRows = db.prepare(`
        SELECT category_id FROM resource_categories 
        WHERE resource_id = ?
      `).all(item.id) as CategoryRow[];

      return {
        ...item,
        categories: categoryRows.map(row => row.category_id)
      } as ItemWithCategories;
    });

    res.json({
      items: itemsWithCategories,
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
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { section, description, preview, categories }: {
      section: string;
      description: string | null;
      preview: {
        title: string;
        description: string;
        image: string | null;
        favicon: string;
        domain: string;
      };
      categories: string[];
    } = req.body;

    db.transaction(() => {
      // Обновляем основные данные
      db.prepare(`
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

      // Удаляем старые категории
      db.prepare('DELETE FROM resource_categories WHERE resource_id = ?').run(id);

      // Добавляем новые категории
      if (categories && categories.length > 0) {
        const insertCategory = db.prepare(
          'INSERT INTO resource_categories (resource_id, category_id) VALUES (?, ?)'
        );
        
        categories.forEach(categoryId => {
          insertCategory.run(id, categoryId);
        });
      }
    })();

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Удаление одобренного материала
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Attempting to delete item with id: ${id}`);
    
    const result = db.prepare('DELETE FROM suggestions WHERE id = ? AND status = ?').run(id, 'approved');

    if (result.changes === 0) {
      console.log('No item found or not authorized to delete');
      return res.status(404).json({ error: 'Item not found or not authorized to delete' });
    }

    console.log('Item successfully deleted');
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 