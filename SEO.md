# Руководство по SEO

## Мета-теги

### Базовые

```tsx
<Helmet>
  <title>Allys Library - Библиотека доступности</title>
  <meta name="description" content="Библиотека материалов по доступности веб-сайтов" />
  <meta name="keywords" content="доступность, a11y, веб-разработка, инклюзивность" />
</Helmet>
```

### Open Graph

```tsx
<Helmet>
  <meta property="og:title" content="Allys Library" />
  <meta property="og:description" content="Библиотека материалов по доступности" />
  <meta property="og:image" content="/og-image.jpg" />
  <meta property="og:url" content="https://allys-library.com" />
  <meta property="og:type" content="website" />
</Helmet>
```

### Twitter Cards

```tsx
<Helmet>
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Allys Library" />
  <meta name="twitter:description" content="Библиотека материалов по доступности" />
  <meta name="twitter:image" content="/twitter-image.jpg" />
</Helmet>
```

## Структурированные данные

### Schema.org

```tsx
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Allys Library",
  "url": "https://allys-library.com",
  "description": "Библиотека материалов по доступности",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://allys-library.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

<Helmet>
  <script type="application/ld+json">
    {JSON.stringify(structuredData)}
  </script>
</Helmet>
```

### Breadcrumbs

```tsx
const breadcrumbsData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Главная",
      "item": "https://allys-library.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Материалы",
      "item": "https://allys-library.com/resources"
    }
  ]
};
```

## Оптимизация URL

### ЧПУ (Человекопонятные URL)

```typescript
// До
/resources/123

// После
/resources/accessibility-guidelines
```

### Канонические URL

```tsx
<Helmet>
  <link
    rel="canonical"
    href="https://allys-library.com/resources/accessibility-guidelines"
  />
</Helmet>
```

## Оптимизация контента

### Заголовки

```tsx
<h1>Главный заголовок страницы</h1>
<h2>Подзаголовок раздела</h2>
<h3>Подзаголовок подраздела</h3>
```

### Изображения

```tsx
<img
  src="image.jpg"
  alt="Подробное описание изображения"
  loading="lazy"
  width="800"
  height="600"
/>
```

### Ссылки

```tsx
<a
  href="/resources/accessibility-guidelines"
  title="Руководство по доступности"
>
  Руководство по доступности
</a>
```

## Техническая оптимизация

### robots.txt

```txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://allys-library.com/sitemap.xml
```

### sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://allys-library.com/</loc>
    <lastmod>2024-03-20</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://allys-library.com/resources</loc>
    <lastmod>2024-03-20</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

## Аналитика

### Google Analytics

```typescript
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <Analytics />
      {/* Остальной код */}
    </>
  );
}
```

### Яндекс.Метрика

```typescript
const YandexMetrika = () => {
  useEffect(() => {
    // Инициализация Яндекс.Метрики
  }, []);

  return null;
};
```

## Мониторинг

### Google Search Console

1. Добавьте сайт
2. Подтвердите владение
3. Отправьте sitemap.xml
4. Настройте мониторинг

### Яндекс.Вебмастер

1. Добавьте сайт
2. Подтвердите владение
3. Отправьте sitemap.xml
4. Настройте мониторинг

## Лучшие практики

1. Используйте семантическую разметку
2. Оптимизируйте скорость загрузки
3. Обеспечьте мобильную версию
4. Используйте HTTPS
5. Создавайте качественный контент
6. Оптимизируйте изображения
7. Используйте внутренние ссылки
8. Регулярно обновляйте контент
9. Мониторьте позиции
10. Анализируйте поведение пользователей

## Инструменты

### Анализ

- Google Search Console
- Яндекс.Вебмастер
- Screaming Frog
- Ahrefs
- SEMrush

### Оптимизация

- Google PageSpeed Insights
- GTmetrix
- Mobile-Friendly Test
- Rich Results Test

## Поддержка

- Документация: [docs/](docs/)
- Issues: [issues/](issues/)
- Чат: #seo в Slack 