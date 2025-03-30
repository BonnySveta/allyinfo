"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.navigationConfig = void 0;
exports.navigationConfig = [
    {
        title: 'Статьи',
        path: '/articles',
        section: '/articles',
        isNew: false
    },
    {
        title: 'Ресурсы',
        path: '/resources',
        section: '/resources',
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
        title: 'YouTube',
        path: '/youtube',
        section: '/youtube',
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
    }
];
console.log('Navigation sections:', exports.navigationConfig.map(item => item.section));
