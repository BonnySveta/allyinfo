// Вспомогательные функции
import { ElementDetails } from './types';

// Вспомогательные функции для проверки состояний ссылок
function isVisitedLink(element: HTMLAnchorElement): boolean {
  const computedStyle = getComputedStyle(element);
  const color = computedStyle.getPropertyValue('color');
  const visitedColor = document.createElement('a').style.getPropertyValue('color');
  return color !== visitedColor;
}

function isCurrentPage(element: HTMLAnchorElement): boolean {
  return element.getAttribute('aria-current') === 'page';
}

// Функция для получения информации о списке
function getListInfo(list: Element) {
  const items = list.querySelectorAll('li, [role="listitem"]');
  return {
    count: items.length,
    items: Array.from(items)
  };
}

// Вспомогательная функция для получения роли элемента
function getRole(element: Element): string {
  const explicitRole = element.getAttribute('role');
  if (explicitRole) return explicitRole;

  // Маппинг HTML элементов на их роли
  const roleMap: Record<string, string> = {
    'a': 'link',
    'button': 'button',
    'h1': 'heading',
    'h2': 'heading',
    'h3': 'heading',
    'h4': 'heading',
    'h5': 'heading',
    'h6': 'heading',
    'input': 'textbox',
    'img': 'image',
    'ul': 'list',
    'ol': 'list',
    'li': 'listitem',
    'nav': 'navigation',
    'main': 'main',
    'header': 'banner',
    'footer': 'contentinfo',
  };

  return roleMap[element.tagName.toLowerCase()] || element.tagName.toLowerCase();
}

// Функция для формирования текста для скринридера
function getTechnicalInfo(element: Element): string {
  const parts: string[] = [];

  // Добавляем тег в угловых скобках
  parts.push(`<${element.tagName.toLowerCase()}>`);

  // Добавляем роль
  const role = element.getAttribute('role') || getRole(element);
  parts.push(`role: ${role}`);

  // Собираем все ARIA-атрибуты
  const ariaAttrs = Array.from(element.attributes)
    .filter(attr => attr.name.startsWith('aria-'))
    .map(attr => `${attr.name}="${attr.value}"`);

  if (ariaAttrs.length > 0) {
    parts.push(`ARIA: ${ariaAttrs.join(', ')}`);
  }

  return parts.join(' | ');
}

function buildScreenReaderText(element: Element, details: ElementDetails): string {
  const mainParts: string[] = [];

  // 1. Основной текст (имя)
  if (details.label) {
    // Добавляем кавычки только для кнопок, которые не являются частью группового заголовка
    if (details.role === 'button' && !details.label.includes('группа.')) {
      mainParts.push(`"${details.label}"`);
    } else {
      mainParts.push(details.label);
    }
  }

  // 2. Роль элемента и состояние
  switch (details.role) {
    case 'button':
      mainParts.push('кнопка');
      if (element.hasAttribute('aria-pressed')) {
        mainParts.push('переключатель');
        mainParts.push(element.getAttribute('aria-pressed') === 'true' ? ', нажата' : ', не нажата');
      }
      break;
    case 'link':
      mainParts.push('ссылка');
      if (details.visited) mainParts.push('посещенная');
      break;
    case 'heading':
      mainParts.push(`заголовок уровня ${details.level}`);
      break;
    case 'checkbox':
      mainParts.push('флажок');
      mainParts.push(details.checked ? 'установлен' : 'не установлен');
      break;
    case 'radio':
      mainParts.push('переключатель');
      mainParts.push(details.checked ? 'выбран' : 'не выбран');
      break;
    case 'combobox':
      mainParts.push('раскрывающийся список');
      if (details.expanded !== undefined) {
        mainParts.push(details.expanded ? 'раскрыт' : 'свёрнут');
      }
      break;
  }

  // 3. Состояния (без горячих клавиш)
  if (details.required) mainParts.push('обязательное поле');
  if (element.hasAttribute('disabled')) mainParts.push('недоступно');
  if (details.expanded !== undefined && !['combobox'].includes(details.role)) {
    mainParts.push(details.expanded ? 'развернуто' : 'свернуто');
  }

  // 4. Позиция в списке/группе
  if (details.position) {
    mainParts.push(`${details.position.current} из ${details.position.total}`);
  }

  // 5. Описание (если есть)
  if (details.description) {
    mainParts.push(details.description);
  }

  // Формируем основной текст скринридера
  const screenReaderText = '🔊 ' + mainParts.join(' ');

  // Получаем техническую информацию через getTechnicalInfo
  const technicalInfo = getTechnicalInfo(element);

  return [
    screenReaderText,
    technicalInfo
  ].join('\n');
}

// Обработка списков
function handleList(element: Element): ElementDetails {
  const baseInfo = getBaseElementInfo(element);
  return { 
    ...baseInfo,
    role: 'list', 
    states: [],
    isInteractive: false,
    virtualOnly: true,
    shortcuts: ['↑/↓: navigate menu']
  };
}

// Обработка ссылок
function handleLink(element: HTMLAnchorElement): ElementDetails {
  const listItem = element.closest('li, [role="listitem"]');
  const list = listItem?.closest('ul, ol, [role="list"]');
  
  // Если это первая ссылка в списке, показываем информацию о списке
  if (list && listItem) {
    const items = Array.from(list.querySelectorAll('li, [role="listitem"]'));
    if (items[0] === listItem) {
      const { count } = getListInfo(list);
      const baseInfo = getBaseElementInfo(element);
      let screenReaderText = `список из ${count} элементов ${element.textContent?.trim()}`;

      if (isVisitedLink(element)) {
        screenReaderText += ', посещенная ссылка';
      }
      if (element.closest('nav, [role="navigation"]') && isCurrentPage(element)) {
        screenReaderText += ', текущая страница';
      }

      return {
        ...baseInfo,
        role: 'list',
        screenReaderText,
        states: [screenReaderText],
        isInteractive: true,
        virtualOnly: true,
        nextFocusableElement: element as HTMLElement,
        shortcuts: ['↑/↓: navigate menu', '1/↵: navigate menu']
      };
    }
  }
  
  // Стандартная обработка ссылки
  const baseInfo = getBaseElementInfo(element);
  let screenReaderText = element.textContent?.trim() || '';

  screenReaderText = buildScreenReaderText(element, baseInfo);

  return {
    ...baseInfo,
    role: 'link',
    screenReaderText,
    states: [...baseInfo.states, screenReaderText],
    isInteractive: true,
    shortcuts: baseInfo.shortcuts || []
  };
}

// Получене базовой информации об элементе
function getBaseElementInfo(element: Element): ElementDetails {
  // Определяем рль элемента
  let role = element.tagName.toLowerCase();
  const ariaRole = element.getAttribute('role');
  
  if (ariaRole) {
    role = ariaRole;
  } else {
    // Маппинг HTML элементов на их роли
    const roleMap: Record<string, string> = {
      'a': 'link',
      'button': 'button',
      'h1': 'heading',
      'h2': 'heading',
      'h3': 'heading',
      'h4': 'heading',
      'h5': 'heading',
      'h6': 'heading',
      'input': 'textbox',
      'img': 'image',
      'ul': 'list',
      'ol': 'list',
      'li': 'listitem',
      'nav': 'navigation',
      'main': 'main',
      'header': 'banner',
      'footer': 'contentinfo',
    };
    role = roleMap[role] || role;
  }

  const info: ElementDetails = {
    role,
    label: element.getAttribute('aria-label') || element.textContent?.trim() || '',
    states: [],
    isInteractive: false
  };

  // Проверяем состояние кнопки-переключателя
  if (element.matches('button, [role="button"]')) {
    const pressed = element.getAttribute('aria-pressed');
    if (pressed !== null) {
      info.pressed = pressed === 'true';
      info.states.push(info.pressed ? 'нажата' : 'не нажата');
    }
  }

  // Определяем уровень заголовка
  if (role === 'heading') {
    const level = parseInt(element.tagName[1]);
    info.level = level;
    info.states.push(`heading level ${level}`);
  }

  // Получаем описание
  info.description = element.getAttribute('aria-description') ?? undefined;

  // Проверяем состояния
  if (element instanceof HTMLElement) {
    if (element.hasAttribute('disabled')) {
      info.states.push('disabled');
    }
    if (element.hasAttribute('readonly')) {
      info.states.push('readonly');
    }
    if (element.hasAttribute('aria-invalid')) {
      info.states.push('invalid');
    }
    if (element.hasAttribute('aria-hidden')) {
      info.states.push('hidden');
    }
  }

  // Проверяем ARIA-атрибуты
  const expanded = element.getAttribute('aria-expanded');
  if (expanded !== null) {
    info.expanded = expanded === 'true';
    info.states.push(info.expanded ? 'expanded' : 'collapsed');
  }

  const checked = element.getAttribute('aria-checked');
  if (checked !== null) {
    info.checked = checked === 'true';
    info.states.push(info.checked ? 'checked' : 'unchecked');
  }

  const required = element.getAttribute('aria-required');
  if (required === 'true') {
    info.required = true;
    info.states.push('required');
  }

  const current = element.getAttribute('aria-current');
  if (current !== null) {
    info.current = current === 'true' ? true : current;
    info.states.push(`current ${current === 'true' ? 'item' : current}`);
  }

  // Проверяем интерактивность и доступность с клавиатуры
  if (element instanceof HTMLElement) {
    // Проверяем tabIndex
    const tabIndex = element.tabIndex;
    if (tabIndex !== undefined) {
      info.tabIndex = tabIndex;
      if (tabIndex >= 0) {
        info.isInteractive = true;
      }
    }

    // Проверяем accesskey
    const accessKey = element.accessKey;
    if (accessKey) {
      info.shortcuts = [`Alt + ${accessKey.toUpperCase()}`];
    }

    // Добавляем информацию о навигации в зависимости от роли
    switch (info.role) {
      case 'button':
        info.shortcuts = [...(info.shortcuts || []), 'Space/Enter: activate'];
        break;
      case 'link':
        info.shortcuts = [...(info.shortcuts || []), 'Enter: follow link'];
        break;
      case 'checkbox':
        info.shortcuts = [...(info.shortcuts || []), 'Space: toggle'];
        break;
      case 'radio':
        info.shortcuts = [...(info.shortcuts || []), '↑/↓: select'];
        break;
      case 'combobox':
      case 'listbox':
        info.shortcuts = [...(info.shortcuts || []), '↑/↓: navigate', 'Enter: select'];
        break;
      case 'slider':
        info.shortcuts = [...(info.shortcuts || []), '←/→: adjust value'];
        break;
      case 'tablist':
        info.shortcuts = [...(info.shortcuts || []), '←/→: switch tabs'];
        break;
    }

    // Проверяем роль в навигации
    if (element.matches('nav a, nav button, [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]')) {
      info.shortcuts = [...(info.shortcuts || []), '↑/↓: navigate menu'];
    }
  }

  // Добавляем проверку позиции в списке
  if (element.matches('li, [role="listitem"], [role="menuitem"], [role="option"], [role="tab"]')) {
    const parent = element.parentElement;
    if (parent) {
      const items = Array.from(parent.children).filter(child => 
        child.matches('li, [role="listitem"], [role="menuitem"], [role="option"], [role="tab"]')
      );
      const currentIndex = items.indexOf(element);
      if (currentIndex !== -1) {
        info.position = {
          current: currentIndex + 1,
          total: items.length
        };
        info.states.push(`${currentIndex + 1} of ${items.length}`);
      }
    }
  }

  // Определяем landmarks и regions
  const landmarkRoles = {
    banner: 'header',
    complementary: 'complementary content',
    contentinfo: 'footer',
    form: 'form',
    main: '',
    navigation: 'navigation',
    region: 'region',
    search: 'search',
  };

  // Проверяем роль элемента как landmark
  if (landmarkRoles[info.role as keyof typeof landmarkRoles]) {
    const landmarkText = landmarkRoles[info.role as keyof typeof landmarkRoles];
    if (landmarkText) {
      info.landmark = landmarkText;
      info.states.push(`landmark: ${landmarkText}`);
    }
  }

  // Проверяем aria-label для егиона
  const regionLabel = element.getAttribute('aria-label');
  if (regionLabel && (info.role === 'region' || element.tagName.toLowerCase() === 'section')) {
    info.region = regionLabel;
    info.states.push(`region: ${regionLabel}`);
  }

  // Собираем информацию о родительских landmarks
  let parent = element.parentElement;
  const parentLandmarks: string[] = [];
  
  while (parent) {
    const parentRole = parent.getAttribute('role');
    const parentTag = parent.tagName.toLowerCase();
    
    if (parentRole && landmarkRoles[parentRole as keyof typeof landmarkRoles]) {
      const landmarkText = landmarkRoles[parentRole as keyof typeof landmarkRoles];
      if (landmarkText) {
        const label = parent.getAttribute('aria-label');
        parentLandmarks.push(label ? 
          `${landmarkText} "${label}"` : 
          landmarkText
        );
      }
    } else if (parentTag in landmarkRoles) {
      const label = parent.getAttribute('aria-label');
      parentLandmarks.push(label ? 
        `${landmarkRoles[parentTag as keyof typeof landmarkRoles]} "${label}"` : 
        landmarkRoles[parentTag as keyof typeof landmarkRoles]
      );
    }
    
    parent = parent.parentElement;
  }

  if (parentLandmarks.length > 0) {
    info.parentLandmarks = parentLandmarks;
    info.states.push(`in ${parentLandmarks.join(' > ')}`);
  }

  // Проверяем дополнительные атрибуты для улучшения конт��кста
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElements = labelledBy.split(' ')
      .map(id => document.getElementById(id))
      .filter(el => el)
      .map(el => el!.textContent)
      .filter(text => text);
    
    if (labelElements.length > 0) {
      info.states.push(`labelled by: ${labelElements.join(' ')}`);
    }
  }

  const describedBy = element.getAttribute('aria-describedby');
  if (describedBy) {
    const descElements = describedBy.split(' ')
      .map(id => document.getElementById(id))
      .filter(el => el)
      .map(el => el!.textContent)
      .filter(text => text);
    
    if (descElements.length > 0) {
      info.states.push(`described by: ${descElements.join(' ')}`);
    }
  }

  // Расширим проверку ARIA-атрибутов
  const ariaAttributes = [
    'aria-label',
    'aria-description',
    'aria-placeholder',
    'aria-valuetext',
    'aria-valuemin',
    'aria-valuemax',
    'aria-valuenow',
    'aria-keyshortcuts',
    'aria-roledescription',
    'aria-owns',
    'aria-controls',
    'aria-details'
  ];

  ariaAttributes.forEach(attr => {
    const value = element.getAttribute(attr);
    if (value) {
      info.states.push(`${attr}: ${value}`);
    }
  });

  // Проверяем состоян��е ссылки
  if (element instanceof HTMLAnchorElement) {
    info.visited = isVisitedLink(element);
  }

  info.screenReaderText = buildScreenReaderText(element, info);

  return info;
}

// Обработка группы фильтров
function handleFilterGroup(element: Element): ElementDetails {
  const filterGroup = element.closest('[role="group"]');
  const isFirstButton = filterGroup?.querySelector('button, [role="button"]') === element;
  
  if (filterGroup && isFirstButton) {
    const baseInfo = getBaseElementInfo(element);
    const groupLabel = filterGroup.getAttribute('aria-label') || 'Фильтр по категориям';
    
    // Для первой кнопки добавляем информацию о группе
    return {
      ...baseInfo,
      screenReaderText: buildScreenReaderText(element, {
        ...baseInfo,
        label: `${groupLabel}, группа. "${baseInfo.label}"`
      }),
      states: [...baseInfo.states],
      isInteractive: true
    };
  }

  // Для остальных кнопок используем стандартную обработку
  return getBaseElementInfo(element);
}

export function getElementInfo(element: Element): ElementDetails {
  // Определяем, является ли элемент фокусируемым
  const isFocusable = element instanceof HTMLElement && (
    element.matches('a[href], button, input, select, textarea, [tabindex], [contenteditable]') ||
    element.hasAttribute('tabindex')
  );

  let info: ElementDetails;

  if (element.matches('a')) {
    info = handleLink(element as HTMLAnchorElement);
  } else if (element.matches('ul, ol, [role="list"]')) {
    info = handleList(element);
  } else if (element.matches('button, [role="button"]') && element.closest('[role="group"]')) {
    info = handleFilterGroup(element);
  } else {
    info = getBaseElementInfo(element);
  }

  // Добавляем информацию о фокусируемости
  info.isFocusable = isFocusable;

  return info;
}

export const LANDMARK_SELECTORS = 
  'nav, [role="navigation"], main, [role="main"], header, [role="banner"], ' +
  'footer, [role="contentinfo"], aside, [role="complementary"], ' +
  'section[aria-label], section[aria-labelledby], [role="region"][aria-label], ' +
  '[role="region"][aria-labelledby], form[aria-label], form[aria-labelledby], ' +
  '[role="form"], [role="search"]'; 