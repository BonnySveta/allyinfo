import Database from 'better-sqlite3';
import bcryptjs from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { config } from '../config';

// Создаем подключение к БД
const db = new Database(path.join(__dirname, '../../data/suggestions.db'), {
  verbose: console.log
});

// Создаем таблицы, если их нет
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
  );

  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
  );
`);

// Функция для инициализации первого админа
export async function initializeAdmin() {
  console.log('\n=== Initializing Admin ===');
  const adminUsername = config.admin.username;
  const adminPassword = config.admin.password;

  if (!adminUsername || !adminPassword) {
    console.warn('Initial admin credentials not provided in config');
    return;
  }

  try {
    console.log('Checking for existing admin...');
    const existingAdmin = db.prepare('SELECT id FROM admins WHERE username = ?').get(adminUsername);

    if (!existingAdmin) {
      console.log('No admin found, creating new admin account...');
      const saltRounds = 10;
      const passwordHash = await bcryptjs.hash(adminPassword, saltRounds);

      db.prepare(
        'INSERT INTO admins (username, password_hash) VALUES (?, ?)'
      ).run(adminUsername, passwordHash);

      console.log('Initial admin account created successfully');
    } else {
      console.log('Admin account already exists');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
    throw error; // Пробрасываем ошибку дальше
  }
  console.log('======================\n');
}

// Добавляем методы для работы с админами
export const adminQueries = {
  findByUsername: db.prepare<string>('SELECT * FROM admins WHERE username = ?'),
  updateLastLogin: db.prepare<number>('UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?'),
  findById: db.prepare<number>('SELECT id FROM admins WHERE id = ?')
};

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
  `),

  insertFeedback: db.prepare(`
    INSERT INTO feedback (message) 
    VALUES (@message)
  `),

  getAllFeedback: db.prepare(`
    SELECT * FROM feedback 
    ORDER BY created_at DESC
  `),

  getFeedbackById: db.prepare(`
    SELECT * FROM feedback 
    WHERE id = @id
  `),

  updateFeedbackStatus: db.prepare(`
    UPDATE feedback 
    SET status = @status 
    WHERE id = @id
  `),

  deleteFeedback: db.prepare(`
    DELETE FROM feedback 
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

export const addFeedback = (message: string) => {
  return queries.insertFeedback.run({ message });
};

export const updateFeedbackStatus = (id: number, status: string) => {
  return queries.updateFeedbackStatus.run({ id, status });
};

export const deleteFeedback = (id: number) => {
  return queries.deleteFeedback.run({ id });
};

export const runMigrations = () => {
  console.log('Running migrations...');
  
  const migrationFiles = [
    'add_resource_categories.sql'
  ];

  migrationFiles.forEach(filename => {
    const filePath = path.join(__dirname, 'migrations', filename);
    const migration = fs.readFileSync(filePath, 'utf8');
    
    console.log(`Executing migration: ${filename}`);
    const statements = migration.split(';').filter(stmt => stmt.trim());
    
    statements.forEach(statement => {
      if (statement.trim()) {
        try {
          db.exec(statement);
        } catch (error) {
          console.error(`Error executing statement: ${statement}`);
          throw error;
        }
      }
    });
  });

  console.log('Migrations completed');
};

export { db }; 