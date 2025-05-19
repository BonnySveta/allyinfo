export const pageConfig = {
  articles: { 
    path: '/articles', 
    title: 'Статьи',
    description: 'Полезные статьи о доступности',
    section_id: 'articles'
  },
  telegram: { 
    path: '/telegram', 
    title: 'Telegram-каналы',
    description: 'Telegram-каналы о доступности',
    section_id: 'telegram'
  },
  podcasts: { 
    path: '/podcasts', 
    title: 'Подкасты',
    description: 'Подкасты на тему доступности',
    section_id: 'podcasts'
  },
  courses: { 
    path: '/courses', 
    title: 'Курсы',
    description: 'Обучающие курсы по доступности',
    section_id: 'courses'
  },
  youtube: { 
    path: '/youtube', 
    title: 'YouTube-каналы',
    description: 'YouTube-каналы и выпуски о доступности',
    section_id: 'youtube'
  },
  books: { 
    path: '/books', 
    title: 'Книги',
    description: 'Книги о цифровой доступности',
    section_id: 'books'
  },
  resources: { 
    path: '/resources', 
    title: 'Ресурсы',
    description: 'Полезные ресурсы и инструменты для работы с доступностью',
    section_id: 'resources'
  }
} as const;

export type ResourceSection = keyof typeof pageConfig; 