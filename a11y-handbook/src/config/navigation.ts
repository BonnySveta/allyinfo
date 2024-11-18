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
    section: 'articles',
    isNew: false
  },
  {
    title: 'События',
    path: '/events',
    section: 'events',
    isNew: true
  },
  {
    title: 'Курсы',
    path: '/courses',
    section: 'courses',
    isNew: true
  },
  {
    title: 'Подкасты',
    path: '/podcasts',
    section: 'podcasts',
    isNew: false
  },
  {
    title: 'YouTube',
    path: '/youtube',
    section: 'youtube',
    isNew: false
  },
  {
    title: 'Telegram',
    path: '/telegram',
    section: 'telegram',
    isNew: false
  },
  {
    title: 'Книги',
    path: '/books',
    section: 'books',
    isNew: false
  }
]; 