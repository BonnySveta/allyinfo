export type CategoryId = 
  | 'general' 
  | 'development' 
  | 'design' 
  | 'games' 
  | 'management' 
  | 'testing';

export interface Category {
  id: CategoryId;
  label: string;
  color?: string; // Опционально для стилизации
}

export const CATEGORIES: Category[] = [
  { id: 'general', label: 'Общее', color: '#4CAF50' },
  { id: 'development', label: 'Разработка', color: '#2196F3' },
  { id: 'design', label: 'Дизайн', color: '#9C27B0' },
  { id: 'games', label: 'Игры', color: '#FF9800' },
  { id: 'management', label: 'Менеджмент', color: '#795548' },
  { id: 'testing', label: 'Тестирование', color: '#607D8B' }
]; 