# Руководство по тестированию

## Установка

1. Установите зависимости:
   ```bash
   npm install
   ```

2. Создайте тестовую базу данных в Supabase

3. Настройте переменные окружения для тестов:
   ```env
   VITE_SUPABASE_URL=your_test_supabase_url
   VITE_SUPABASE_ANON_KEY=your_test_supabase_anon_key
   ```

## Запуск тестов

### Все тесты

```bash
npm test
```

### Модульные тесты

```bash
npm run test:unit
```

### Интеграционные тесты

```bash
npm run test:integration
```

### E2E тесты

```bash
npm run test:e2e
```

## Структура тестов

```
tests/
├── unit/              # Модульные тесты
│   ├── components/    # Тесты компонентов
│   ├── hooks/        # Тесты хуков
│   └── utils/        # Тесты утилит
├── integration/      # Интеграционные тесты
│   ├── api/         # Тесты API
│   └── db/          # Тесты базы данных
└── e2e/             # E2E тесты
    └── specs/       # Тестовые сценарии
```

## Написание тестов

### Модульные тесты

```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Интеграционные тесты

```typescript
import { supabase } from '../lib/supabase';

describe('API', () => {
  it('creates a resource', async () => {
    const response = await supabase
      .from('resources')
      .insert({ title: 'Test' });
    expect(response.status).toBe(201);
  });
});
```

### E2E тесты

```typescript
describe('Resource Creation', () => {
  it('creates a new resource', () => {
    cy.visit('/admin');
    cy.get('[data-testid="add-resource"]').click();
    cy.get('[data-testid="title"]').type('Test Resource');
    cy.get('[data-testid="submit"]').click();
    cy.get('[data-testid="success"]').should('be.visible');
  });
});
```

## Моки и стабы

### Моки Supabase

```typescript
import { vi } from 'vitest';

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        data: [{ id: 1, title: 'Test' }],
        error: null
      })
    })
  })
}));
```

### Моки API

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/resources', (req, res, ctx) => {
    return res(ctx.json([{ id: 1, title: 'Test' }]));
  })
);
```

## Тестовые данные

### Фикстуры

```typescript
// fixtures/resources.ts
export const resources = [
  {
    id: 1,
    title: 'Test Resource',
    description: 'Test Description'
  }
];
```

### Фабрики

```typescript
// factories/resource.ts
export const createResource = (overrides = {}) => ({
  id: 1,
  title: 'Test Resource',
  description: 'Test Description',
  ...overrides
});
```

## CI/CD

### GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
```

## Отчеты

### Покрытие кода

```bash
npm run test:coverage
```

### Отчеты о тестах

```bash
npm run test:report
```

## Лучшие практики

1. Тестируйте поведение, а не реализацию
2. Используйте описательные названия тестов
3. Следуйте принципу AAA (Arrange, Act, Assert)
4. Изолируйте тесты друг от друга
5. Используйте моки для внешних зависимостей
6. Поддерживайте тесты в актуальном состоянии

## Отладка

### Логи

```bash
npm run test:debug
```

### Инспектор

```bash
npm run test:inspect
```

## Поддержка

- Документация: [docs/](docs/)
- Issues: [issues/](issues/)
- Чат: #testing в Slack 