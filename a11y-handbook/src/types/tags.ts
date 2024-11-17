export type TagType = 'general' | 'dev' | 'qa' | 'design' | 'management';

export interface Tag {
  id: TagType;
  label: string;
  color: string;
}

export const TAGS: Record<TagType, Tag> = {
  general: {
    id: 'general',
    label: 'Общее',
    color: '#6366F1' // Индиго
  },
  dev: {
    id: 'dev',
    label: 'Разработчикам',
    color: '#2563EB' // Синий
  },
  qa: {
    id: 'qa',
    label: 'Тестировщикам',
    color: '#16A34A' // Зеленый
  },
  design: {
    id: 'design',
    label: 'Дизайнерам',
    color: '#DB2777' // Розовый
  },
  management: {
    id: 'management',
    label: 'Менеджерам',
    color: '#9333EA' // Фиолетовый
  }
}; 