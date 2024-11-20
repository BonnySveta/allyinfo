import { Request, Response } from 'express';
import { Database } from 'better-sqlite3';
import { buildSearchQuery, SearchParams } from '../services/search';

export function searchController(db: Database) {
  return async (req: Request, res: Response) => {
    try {
      const searchParams: SearchParams = {
        search: req.query.search as string,
        section: req.query.section as string,
        sortBy: req.query.sortBy as string,
        order: req.query.order as string,
        page: req.query.page as string,
        limit: req.query.limit as string
      };

      const { query, params } = buildSearchQuery(searchParams);
      
      console.log('Search query:', query);
      console.log('Search params:', params);

      const rows = db.prepare(query).all(params);

      // Пагинация
      const page = Number(searchParams.page) || 1;
      const limit = Number(searchParams.limit) || 10;
      const offset = (page - 1) * limit;
      
      const items = rows.slice(offset, offset + limit);

      res.json({
        items,
        pagination: {
          total: rows.length,
          page,
          limit,
          totalPages: Math.ceil(rows.length / limit)
        }
      });

    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ 
        error: 'Failed to search suggestions',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
} 