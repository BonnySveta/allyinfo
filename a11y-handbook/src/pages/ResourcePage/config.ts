export const pageConfig = {
  articles: { 
    path: '/articles', 
    title: 'Статьи',
    description: 'Полезные статьи о веб-доступности'
  },
  telegram: { 
    path: '/telegram', 
    title: 'Telegram-каналы',
    description: 'Telegram-каналы о доступности'
  },
  podcasts: { 
    path: '/podcasts', 
    title: 'Подкасты',
    description: 'Подкасты на тему доступности'
  },
  courses: { 
    path: '/courses', 
    title: 'Курсы',
    description: 'Обучающие курсы по веб-доступности'
  },
  youtube: { 
    path: '/youtube', 
    title: 'YouTube-каналы',
    description: 'YouTube-каналы о доступности'
  },
  books: { 
    path: '/books', 
    title: 'Книги',
    description: 'Книги о веб-доступности'
  },
} as const;

export type ResourceSection = keyof typeof pageConfig; 