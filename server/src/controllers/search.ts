import { Request, Response } from 'express';
import { Database } from 'better-sqlite3';
import { buildSearchQuery, SearchParams } from '../services/search';

export function searchController(db: Database) {
  return async (req: Request, res: Response) => {
    try {
      const {
        search = '',
        section = '',
        sortBy = 'date',
        order = 'desc',
        page = '1',
        limit = '10',
        status = 'pending'
      } = req.query;

      let query = `
        SELECT * FROM suggestions 
        WHERE 1=1
        AND status = @status
      `;

      const params: any = {
        status
      };

      if (search) {
        query += ` 
          AND (
            preview_title LIKE @search 
            OR preview_description LIKE @search 
            OR description LIKE @search
          )
        `;
        params.search = `%${search}%`;
      }

      if (section) {
        query += ` AND section = @section`;
        params.section = section;
      }

      // Получаем общее количество записей для пагинации
      const countQuery = db.prepare(query.replace('*', 'COUNT(*) as total'));
      const { total } = countQuery.get(params) as { total: number };

      // Добавляем сортировку и пагинацию
      const sortColumn = {
        date: 'created_at',
        title: 'preview_title',
        section: 'section'
      }[sortBy as string] || 'created_at';

      query += ` ORDER BY ${sortColumn} ${order === 'asc' ? 'ASC' : 'DESC'}`;
      query += ` LIMIT @limit OFFSET @offset`;

      params.limit = Number(limit);
      params.offset = (Number(page) - 1) * Number(limit);

      const stmt = db.prepare(query);
      const items = stmt.all(params);

      res.json({
        items,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit))
        }
      });

    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ 
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
} 