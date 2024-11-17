interface NavigationItem {
  title: string;
  path: string;
  isNew?: boolean;
  children?: NavigationItem[];
}

export const navigationConfig: NavigationItem[] = [
  {
    title: 'Статьи',
    path: '/articles',
    children: [
      {
        title: 'Для разработчиков',
        path: '/articles/dev'
      },
      {
        title: 'Для тестировщиков',
        path: '/articles/qa'
      },
      {
        title: 'Для дизайнеров',
        path: '/articles/design'
      },
      {
        title: 'Для менеджеров',
        path: '/articles/management'
      }
    ]
  },
  {
    title: 'События',
    path: '/events',
    isNew: true,
    children: [
      {
        title: 'Конференции',
        path: '/events/conferences'
      },
      {
        title: 'Митапы',
        path: '/events/meetups'
      },
      {
        title: 'Вебинары',
        path: '/events/webinars'
      }
    ]
  },
  {
    title: 'Курсы',
    path: '/courses',
    isNew: true
  },
  {
    title: 'Подкасты',
    path: '/podcasts'
  },
  {
    title: 'YouTube',
    path: '/youtube'
  },
  {
    title: 'Telegram-каналы',
    path: '/telegram'
  },
  {
    title: 'Книги',
    path: '/books'
  }
]; 