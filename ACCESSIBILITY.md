# Руководство по доступности

## Стандарты

Проект следует стандартам доступности WCAG 2.1 уровня AA.

## Компоненты

### Кнопки

```tsx
<button
  aria-label="Описание действия"
  onClick={handleClick}
>
  Текст кнопки
</button>
```

### Формы

```tsx
<form>
  <label htmlFor="name">Имя</label>
  <input
    id="name"
    type="text"
    aria-required="true"
    aria-invalid={!!error}
    aria-describedby="name-error"
  />
  {error && (
    <div id="name-error" role="alert">
      {error}
    </div>
  )}
</form>
```

### Навигация

```tsx
<nav aria-label="Основное меню">
  <ul>
    <li>
      <a href="/" aria-current={isCurrentPage('/')}>
        Главная
      </a>
    </li>
  </ul>
</nav>
```

## ARIA атрибуты

### Роли

- `role="alert"` - для важных сообщений
- `role="dialog"` - для модальных окон
- `role="tablist"` - для табов
- `role="tab"` - для отдельных табов
- `role="tabpanel"` - для содержимого табов

### Состояния

- `aria-expanded` - для раскрывающихся элементов
- `aria-selected` - для выбранных элементов
- `aria-hidden` - для скрытых элементов
- `aria-disabled` - для отключенных элементов

## Клавиатурная навигация

### Фокус

```tsx
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    // Действие
  }
};
```

### Tab порядок

```tsx
<div tabIndex={0}>
  Фокусируемый элемент
</div>
```

## Цветовой контраст

### Минимальные требования

- Текст: 4.5:1
- Крупный текст: 3:1
- UI элементы: 3:1

### Проверка

```bash
npm run check-contrast
```

## Скринридеры

### Тестирование

- NVDA
- VoiceOver
- JAWS
- TalkBack

### Поддержка

```tsx
<div
  role="region"
  aria-label="Описание региона"
>
  Содержимое
</div>
```

## Мобильная доступность

### Touch targets

- Минимальный размер: 44x44px
- Отступы между элементами: 8px

### Жесты

```tsx
const handleSwipe = (direction: 'left' | 'right') => {
  // Обработка свайпа
};
```

## Тестирование

### Автоматическое

```bash
npm run test:a11y
```

### Ручное

1. Проверка с клавиатуры
2. Проверка со скринридером
3. Проверка контраста
4. Проверка масштабирования

## Инструменты

### Линтеры

- eslint-plugin-jsx-a11y
- @axe-core/react

### Тестирование

- axe-core
- pa11y
- Lighthouse

## Документация

### Компоненты

```tsx
/**
 * @accessibility
 * - Поддерживает клавиатурную навигацию
 * - Имеет ARIA атрибуты
 * - Контрастный текст
 */
```

### Страницы

```tsx
/**
 * @accessibility
 * - Семантическая разметка
 * - Логический порядок
 * - Пропуск навигации
 */
```

## Поддержка

- Документация: [docs/](docs/)
- Issues: [issues/](issues/)
- Чат: #accessibility в Slack 