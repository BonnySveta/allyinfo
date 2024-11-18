"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.queries = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
// Создаем подключение к БД
const db = new better_sqlite3_1.default(path_1.default.join(__dirname, '../../data/suggestions.db'), {
    verbose: console.log
});
exports.db = db;
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
exports.queries = {
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
  `)
};
