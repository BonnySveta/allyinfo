-- Таблица категорий
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  color TEXT
);

-- Таблица связей материалов с категориями
CREATE TABLE IF NOT EXISTS resource_categories (
  resource_id INTEGER,
  category_id TEXT,
  PRIMARY KEY (resource_id, category_id),
  FOREIGN KEY (resource_id) REFERENCES suggestions(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Заполняем таблицу категорий начальными данными
INSERT OR IGNORE INTO categories (id, label, color) VALUES
  ('general', 'Общее', '#4CAF50'),
  ('development', 'Разработка', '#2196F3'),
  ('design', 'Дизайн', '#9C27B0'),
  ('games', 'Игры', '#FF9800'),
  ('management', 'Менеджмент', '#795548'),
  ('testing', 'Тестирование', '#607D8B'); 