import { TagType } from '../types/tags';

interface NavigationItem {
  title: string;
  path: string;
  isNew?: boolean;
  tags?: TagType[];
  children?: NavigationItem[];
}

export const navigationConfig: NavigationItem[] = [
  {
    title: 'Статьи',
    path: '/articles',
    tags: ['general'],
    children: [
      {
        title: 'Для разработчиков',
        path: '/articles/dev',
        tags: ['dev']
      },
      {
        title: 'Для тестировщиков',
        path: '/articles/qa',
        tags: ['qa']
      },
      {
        title: 'Для дизайнеров',
        path: '/articles/design',
        tags: ['design']
      },
      {
        title: 'Для менеджеров',
        path: '/articles/management',
        tags: ['management']
      }
    ]
  },
  {
    title: 'События',
    path: '/events',
    tags: ['general'],
    isNew: true,
    children: [
      {
        title: 'Конференции',
        path: '/events/conferences',
        tags: ['general']
      },
      {
        title: 'Митапы',
        path: '/events/meetups',
        tags: ['general']
      },
      {
        title: 'Вебинары',
        path: '/events/webinars',
        tags: ['general']
      }
    ]
  },
  {
    title: 'Курсы',
    path: '/courses',
    tags: ['general'],
    isNew: true
  },
  {
    title: 'Подкасты',
    path: '/podcasts',
    tags: ['general']
  },
  {
    title: 'YouTube',
    path: '/youtube',
    tags: ['general']
  },
  {
    title: 'Telegram-каналы',
    path: '/telegram',
    tags: ['general']
  },
  {
    title: 'Книги',
    path: '/books',
    tags: ['general']
  }
]; 