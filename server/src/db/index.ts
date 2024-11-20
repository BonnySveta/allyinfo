import Database from 'better-sqlite3';
import path from 'path';

// Создаем подключение к БД
const db = new Database(path.join(__dirname, '../../data/suggestions.db'), {
  verbose: console.log
});

// Создаем таблицу, если её нет
db.exec(`
  CREATE TABLE IF NOT EXISTS suggestions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    section TEXT NOT NULL,
    description TEXT,
    preview_title TEXT NOT NULL,
    preview_description TEXT,
    preview_image TEXT,
    preview_favicon TEXT NOT NULL,
    preview_domain TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Подготавливаем запросы
export const queries = {
  insert: db.prepare(`
    INSERT INTO suggestions (
      url, section, description,
      preview_title, preview_description, preview_image,
      preview_favicon, preview_domain, status
    ) VALUES (
      @url, @section, @description,
      @preview_title, @preview_description, @preview_image,
      @preview_favicon, @preview_domain, @status
    )
  `),

  getAll: db.prepare(`
    SELECT * FROM suggestions 
    ORDER BY created_at DESC
  `),

  getById: db.prepare(`
    SELECT * FROM suggestions 
    WHERE id = @id
  `),

  getApproved: db.prepare(`
    SELECT * FROM suggestions 
    WHERE status = 'approved' 
    ORDER BY created_at DESC
  `),

  getPending: db.prepare(`
    SELECT * FROM suggestions 
    WHERE status = 'pending' 
    ORDER BY created_at DESC
  `),

  updateStatus: db.prepare(`
    UPDATE suggestions 
    SET status = @status 
    WHERE id = @id
  `),

  update: db.prepare(`
    UPDATE suggestions 
    SET 
      section = @section,
      description = @description,
      preview_title = @preview_title,
      preview_domain = @preview_domain
    WHERE id = @id
  `),

  delete: db.prepare(`
    DELETE FROM suggestions 
    WHERE id = @id
  `)
};

// Добавляем функции-обертки для удобства использования
export const updateSuggestion = (id: number, data: {
  section: string;
  description: string | null;
  preview: {
    title: string;
    domain: string;
  };
}) => {
  return queries.update.run({
    id,
    section: data.section,
    description: data.description,
    preview_title: data.preview.title,
    preview_domain: data.preview.domain
  });
};

export const deleteSuggestion = (id: number) => {
  return queries.delete.run({ id });
};

export { db }; 