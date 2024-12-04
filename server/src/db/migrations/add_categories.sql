CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  color TEXT
);

CREATE TABLE IF NOT EXISTS resource_categories (
  resource_id INTEGER,
  category_id TEXT,
  PRIMARY KEY (resource_id, category_id),
  FOREIGN KEY (resource_id) REFERENCES suggestions(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
); 