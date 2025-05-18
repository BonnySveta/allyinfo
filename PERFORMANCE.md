# Руководство по производительности

## Метрики

### Core Web Vitals

- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1

### Дополнительные метрики

- TTI (Time to Interactive) < 3.8s
- TBT (Total Blocking Time) < 300ms
- FCP (First Contentful Paint) < 1.8s

## Оптимизация

### Загрузка

1. Оптимизация изображений:
   ```bash
   npm run optimize-images
   ```

2. Ленивая загрузка:
   ```tsx
   <img
     loading="lazy"
     src="image.jpg"
     alt="Description"
   />
   ```

3. Предзагрузка критических ресурсов:
   ```html
   <link
     rel="preload"
     href="critical.css"
     as="style"
   />
   ```

### Рендеринг

1. Мемоизация:
   ```tsx
   const MemoizedComponent = React.memo(Component);
   ```

2. Виртуализация списков:
   ```tsx
   import { VirtualList } from 'react-virtualized';

   <VirtualList
     width={300}
     height={400}
     rowCount={items.length}
     rowHeight={20}
     rowRenderer={({ index, style }) => (
       <div style={style}>
         {items[index]}
       </div>
     )}
   />
   ```

3. Оптимизация ререндеров:
   ```tsx
   const handleClick = useCallback(() => {
     // Действие
   }, []);
   ```

### Кэширование

1. Service Worker:
   ```typescript
   // service-worker.ts
   const CACHE_NAME = 'v1';

   self.addEventListener('install', (event) => {
     event.waitUntil(
       caches.open(CACHE_NAME).then((cache) => {
         return cache.addAll([
           '/',
           '/index.html',
           '/styles.css',
           '/app.js'
         ]);
       })
     );
   });
   ```

2. Кэширование API:
   ```typescript
   const cache = new Map();

   const fetchWithCache = async (url: string) => {
     if (cache.has(url)) {
       return cache.get(url);
     }

     const response = await fetch(url);
     const data = await response.json();
     cache.set(url, data);
     return data;
   };
   ```

## Мониторинг

### Метрики

1. Lighthouse:
   ```bash
   npm run lighthouse
   ```

2. Web Vitals:
   ```typescript
   import { getCLS, getFID, getLCP } from 'web-vitals';

   getCLS(console.log);
   getFID(console.log);
   getLCP(console.log);
   ```

### Профилирование

1. React Profiler:
   ```tsx
   <Profiler
     id="App"
     onRender={(id, phase, actualDuration) => {
       console.log(`${id} ${phase} ${actualDuration}`);
     }}
   >
     <App />
   </Profiler>
   ```

2. Chrome DevTools:
   - Performance tab
   - Memory tab
   - Network tab

## Оптимизация сборки

### Разделение кода

```typescript
const Component = React.lazy(() => import('./Component'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
}
```

### Tree Shaking

```typescript
// webpack.config.js
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    sideEffects: true
  }
};
```

### Минификация

```typescript
// webpack.config.js
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ]
  }
};
```

## Оптимизация API

### Запросы

1. Дебаунс:
   ```typescript
   const debounce = (fn: Function, delay: number) => {
     let timeoutId: NodeJS.Timeout;
     return (...args: any[]) => {
       clearTimeout(timeoutId);
       timeoutId = setTimeout(() => fn(...args), delay);
     };
   };
   ```

2. Троттлинг:
   ```typescript
   const throttle = (fn: Function, delay: number) => {
     let lastCall = 0;
     return (...args: any[]) => {
       const now = Date.now();
       if (now - lastCall >= delay) {
         lastCall = now;
         return fn(...args);
       }
     };
   };
   ```

### Кэширование

1. Redis:
   ```typescript
   import Redis from 'ioredis';

   const redis = new Redis();

   const getCachedData = async (key: string) => {
     const cached = await redis.get(key);
     if (cached) {
       return JSON.parse(cached);
     }
     const data = await fetchData();
     await redis.set(key, JSON.stringify(data), 'EX', 3600);
     return data;
   };
   ```

2. In-memory:
   ```typescript
   const cache = new Map();

   const getCachedData = async (key: string) => {
     if (cache.has(key)) {
       return cache.get(key);
     }
     const data = await fetchData();
     cache.set(key, data);
     return data;
   };
   ```

## Лучшие практики

1. Оптимизируйте изображения
2. Используйте ленивую загрузку
3. Минимизируйте JavaScript
4. Используйте кэширование
5. Оптимизируйте шрифты
6. Используйте CDN
7. Сжимайте ресурсы
8. Оптимизируйте CSS
9. Используйте HTTP/2
10. Минимизируйте ререндеры

## Инструменты

### Анализ

- Lighthouse
- WebPageTest
- Chrome DevTools
- React Profiler

### Оптимизация

- ImageOptim
- Terser
- PurgeCSS
- Compression

## Поддержка

- Документация: [docs/](docs/)
- Issues: [issues/](issues/)
- Чат: #performance в Slack 