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
  { id: 'design', label: 'Дизайн', color: '#9C27B0' },
  { id: 'games', label: 'Игры', color: '#d43f00' },
  { id: 'management', label: 'Менеджмент', color: '#795548' },
  { id: 'general', label: 'Общее', color: '#4CAF50' },
  { id: 'development', label: 'Разработка', color: '#2196F3' },
  { id: 'testing', label: 'Тестирование', color: '#3e4d7a' }
]; 