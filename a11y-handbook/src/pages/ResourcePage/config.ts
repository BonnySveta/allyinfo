export const pageConfig = {
  articles: { 
    path: '/articles', 
    title: 'Статьи',
    description: 'Полезные статьи о доступности',
    section_id: 'articles'
  },
  blogs: { 
    path: '/blogs', 
    title: 'Блоги',
    description: 'Блоги о цифровой доступности',
    section_id: 'blogs'
  },
  wcag: { 
    path: '/wcag', 
    title: 'WCAG',
    description: 'Материалы по WCAG и стандартам доступности',
    section_id: 'wcag'
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
  video: { 
    path: '/video', 
    title: 'Видео',
    description: 'Видео и выпуски о доступности',
    section_id: 'video'
  },
  books: { 
    path: '/books', 
    title: 'Книги',
    description: 'Книги о цифровой доступности',
    section_id: 'books'
  },
  tools: {
    path: '/tools',
    title: 'Инструменты',
    description: 'Полезные инструменты для работы с доступностью',
    section_id: 'tools'
  },
} as const;

export type ResourceSection = keyof typeof pageConfig; 