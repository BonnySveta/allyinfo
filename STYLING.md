# Руководство по стилизации

## Методология

Проект использует методологию БЭМ (Block Element Modifier) для организации CSS.

## Структура

```
styles/
├── base/           # Базовые стили
├── components/     # Стили компонентов
├── layouts/        # Стили макетов
├── themes/         # Темы
└── utils/          # Утилиты
```

## Переменные

### Цвета

```scss
:root {
  // Основные цвета
  --color-primary: #007AFF;
  --color-secondary: #5856D6;
  --color-success: #34C759;
  --color-danger: #FF3B30;
  --color-warning: #FF9500;
  --color-info: #5AC8FA;

  // Нейтральные цвета
  --color-gray-100: #F2F2F7;
  --color-gray-200: #E5E5EA;
  --color-gray-300: #D1D1D6;
  --color-gray-400: #C7C7CC;
  --color-gray-500: #AEAEB2;
  --color-gray-600: #8E8E93;
  --color-gray-700: #636366;
  --color-gray-800: #48484A;
  --color-gray-900: #3A3A3C;

  // Текст
  --color-text-primary: var(--color-gray-900);
  --color-text-secondary: var(--color-gray-700);
  --color-text-tertiary: var(--color-gray-500);
}
```

### Типография

```scss
:root {
  // Размеры шрифтов
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;

  // Межстрочные интервалы
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  // Шрифты
  --font-family-sans: system-ui, -apple-system, sans-serif;
  --font-family-mono: ui-monospace, monospace;
}
```

### Отступы

```scss
:root {
  // Базовый отступ
  --spacing-unit: 0.25rem;

  // Отступы
  --spacing-1: calc(var(--spacing-unit) * 1);
  --spacing-2: calc(var(--spacing-unit) * 2);
  --spacing-3: calc(var(--spacing-unit) * 3);
  --spacing-4: calc(var(--spacing-unit) * 4);
  --spacing-5: calc(var(--spacing-unit) * 5);
  --spacing-6: calc(var(--spacing-unit) * 6);
  --spacing-8: calc(var(--spacing-unit) * 8);
  --spacing-10: calc(var(--spacing-unit) * 10);
  --spacing-12: calc(var(--spacing-unit) * 12);
  --spacing-16: calc(var(--spacing-unit) * 16);
}
```

## Компоненты

### Кнопки

```scss
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;

  &--primary {
    background-color: var(--color-primary);
    color: white;

    &:hover {
      background-color: darken(var(--color-primary), 10%);
    }
  }

  &--secondary {
    background-color: var(--color-secondary);
    color: white;

    &:hover {
      background-color: darken(var(--color-secondary), 10%);
    }
  }
}
```

### Карточки

```scss
.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: var(--spacing-4);

  &__header {
    margin-bottom: var(--spacing-4);
  }

  &__body {
    margin-bottom: var(--spacing-4);
  }

  &__footer {
    border-top: 1px solid var(--color-gray-200);
    padding-top: var(--spacing-4);
  }
}
```

## Утилиты

### Отступы

```scss
.m-1 { margin: var(--spacing-1); }
.m-2 { margin: var(--spacing-2); }
.m-3 { margin: var(--spacing-3); }
.m-4 { margin: var(--spacing-4); }

.mt-1 { margin-top: var(--spacing-1); }
.mt-2 { margin-top: var(--spacing-2); }
.mt-3 { margin-top: var(--spacing-3); }
.mt-4 { margin-top: var(--spacing-4); }

// Аналогично для padding
```

### Типография

```scss
.text-xs { font-size: var(--font-size-xs); }
.text-sm { font-size: var(--font-size-sm); }
.text-base { font-size: var(--font-size-base); }
.text-lg { font-size: var(--font-size-lg); }
.text-xl { font-size: var(--font-size-xl); }

.font-bold { font-weight: 700; }
.font-medium { font-weight: 500; }
.font-normal { font-weight: 400; }
```

## Адаптивность

### Брейкпоинты

```scss
$breakpoints: (
  'sm': 640px,
  'md': 768px,
  'lg': 1024px,
  'xl': 1280px,
  '2xl': 1536px
);

@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  }
}
```

### Использование

```scss
.container {
  width: 100%;
  padding: var(--spacing-4);

  @include respond-to('md') {
    padding: var(--spacing-6);
  }

  @include respond-to('lg') {
    padding: var(--spacing-8);
  }
}
```

## Анимации

### Базовые

```scss
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

### Использование

```scss
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

.slide-in {
  animation: slideIn 0.3s ease-in-out;
}
```

## Темы

### Светлая тема

```scss
[data-theme="light"] {
  --color-background: white;
  --color-text: var(--color-gray-900);
  --color-border: var(--color-gray-200);
}
```

### Темная тема

```scss
[data-theme="dark"] {
  --color-background: var(--color-gray-900);
  --color-text: var(--color-gray-100);
  --color-border: var(--color-gray-700);
}
```

## Лучшие практики

1. Используйте CSS переменные
2. Следуйте БЭМ методологии
3. Используйте семантические классы
4. Минимизируйте вложенность
5. Используйте утилиты
6. Поддерживайте консистентность
7. Оптимизируйте производительность

## Инструменты

### Линтеры

- stylelint
- prettier

### Препроцессоры

- Sass
- PostCSS

### Оптимизация

- PurgeCSS
- cssnano

## Поддержка

- Документация: [docs/](docs/)
- Issues: [issues/](issues/)
- Чат: #styling в Slack 