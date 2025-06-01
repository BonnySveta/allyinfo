interface NavigationItem {
  title: string;
  path: string;
  section: string;
  isNew?: boolean;
}

export const navigationConfig: NavigationItem[] = [
  {
    title: 'Статьи',
    path: '/articles',
    section: '/articles',
    isNew: false
  },
  {
    title: 'Блоги',
    path: '/blogs',
    section: '/blogs',
    isNew: false
  },
  {
    title: 'WCAG',
    path: '/wcag',
    section: '/wcag',
    isNew: false
  },
  {
    title: 'Курсы',
    path: '/courses',
    section: '/courses',
    isNew: false
  },
  {
    title: 'Подкасты',
    path: '/podcasts',
    section: '/podcasts',
    isNew: false
  },
  {
    title: 'Видео',
    path: '/video',
    section: '/video',
    isNew: false
  },
  {
    title: 'Telegram',
    path: '/telegram',
    section: '/telegram',
    isNew: false
  },
  {
    title: 'Книги',
    path: '/books',
    section: '/books',
    isNew: false
  },
  {
    title: 'Инструменты',
    path: '/tools',
    section: '/tools',
    isNew: false
  }
]; 

console.log('Navigation sections:', navigationConfig.map(item => item.section)); 