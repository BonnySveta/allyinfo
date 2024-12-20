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
  const currentPath = window.location.pathname;
  const linkPath = element.pathname;
  return currentPath === linkPath || 
         (currentPath === '/' && linkPath === '/home') || 
         (currentPath === '/home' && linkPath === '/');
}

// Функция для получения информации о списке
function getListInfo(list: Element) {
  const items = list.querySelectorAll('li, [role="listitem"]');
  return {
    count: items.length,
    items: Array.from(items)
  };
}

// Функция для формирования текста для скринридера
function buildScreenReaderText(base: string, options: {
  isVisited?: boolean;
  isCurrentPage?: boolean;
}): string {
  let text = base;
  if (options.isVisited) {
    text += ', посещенная ссылка';
  }
  if (options.isCurrentPage) {
    text += ', текущая страница';
  }
  return text;
}

// Обработка списков
function handleList(element: Element): ElementDetails {
  const { count, items } = getListInfo(element);
  if (count > 0) {
    // Получаем первую ссылку в списке
    const firstItem = items[0];
    const firstLink = firstItem.querySelector('a');

    if (firstLink) {
      // Формируем полный текст с информацией о списке и первой ссылке
      let screenReaderText = `список из ${count} элементов ${firstLink.textContent?.trim()}`;

      if (firstLink instanceof HTMLAnchorElement) {
        // Добавляем информацию о состоянии ссылки
        if (isVisitedLink(firstLink)) {
          screenReaderText += ', посещенная ссылка';
        }

        // Добавляем информацию о текущей странице для навигации
        if (element.closest('nav, [role="navigation"]') && isCurrentPage(firstLink)) {
          screenReaderText += ', текущая страница';
        }
      }

      return {
        ...getBaseElementInfo(element),
        role: 'list',
        screenReaderText,
        states: [screenReaderText],
        isInteractive: false
      };
    }

    // Если нет ссылки, показываем только информацию о списке
    return { 
      ...getBaseElementInfo(element),
      role: 'list',
      screenReaderText: `список из ${count} элементов`,
      states: [`список из ${count} элементов`],
      isInteractive: false 
    };
  }
  return { 
    ...getBaseElementInfo(element),
    role: 'list', 
    states: [],
    isInteractive: false 
  };
}

// Обработка ссылок
function handleLink(element: HTMLAnchorElement): ElementDetails {
  const baseInfo = getBaseElementInfo(element);
  const listItem = element.closest('li, [role="listitem"]');
  const list = listItem?.closest('ul, ol, [role="list"]');
  let screenReaderText = element.textContent?.trim() || '';

  if (list) {
    const { count, items } = getListInfo(list);
    const index = items.indexOf(listItem as Element);
    
    // Для первой ссылки в списке добавляем информацию о списке
    if (index === 0) {
      screenReaderText = `список из ${count} элементов ${screenReaderText}`;
    }
  }

  screenReaderText = buildScreenReaderText(screenReaderText, {
    isVisited: isVisitedLink(element),
    isCurrentPage: element.closest('nav, [role="navigation"]') ? isCurrentPage(element) : false
  });

  return {
    ...baseInfo,
    role: 'link',
    screenReaderText,
    states: [...baseInfo.states, screenReaderText],
    isInteractive: true,
    shortcuts: [...(baseInfo.shortcuts || []), 'Enter: follow link']
  };
}

// Получение базовой информации об элементе
function getBaseElementInfo(element: Element): ElementDetails {
  // Определяем роль элемента
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
    states: [],
    isInteractive: false
  };

  // Определяем уровень заголовка
  if (role === 'heading') {
    const level = parseInt(element.tagName[1]);
    info.level = level;
    info.states.push(`heading level ${level}`);
    
    // Добавим информацию о структуре заголовков
    const allHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    const headingIndex = allHeadings.indexOf(element) + 1;
    if (headingIndex > 0) {
      info.states.push(`heading ${headingIndex} of ${allHeadings.length}`);
    }
  }

  // Получаем метку элемента
  info.label = element.getAttribute('aria-label') ?? 
               element.getAttribute('alt') ?? 
               element.getAttribute('title') ??
               element.textContent?.trim() ??
               undefined;

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

  const pressed = element.getAttribute('aria-pressed');
  if (pressed !== null) {
    info.pressed = pressed === 'true';
    info.states.push(info.pressed ? 'pressed' : 'not pressed');
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
    main: 'main content',
    navigation: 'navigation',
    region: 'region',
    search: 'search',
  };

  // Проверяем роль элемента как landmark
  if (landmarkRoles[role as keyof typeof landmarkRoles]) {
    info.landmark = landmarkRoles[role as keyof typeof landmarkRoles];
    info.states.push(`landmark: ${info.landmark}`);
  }

  // Проверяем aria-label для региона
  const regionLabel = element.getAttribute('aria-label');
  if (regionLabel && (role === 'region' || element.tagName.toLowerCase() === 'section')) {
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
      const label = parent.getAttribute('aria-label');
      parentLandmarks.push(label ? 
        `${landmarkRoles[parentRole as keyof typeof landmarkRoles]} "${label}"` : 
        landmarkRoles[parentRole as keyof typeof landmarkRoles]
      );
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

  // Проверяем дополнительные атрибуты для улучшения контекста
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

  return info;
}

export function getElementInfo(element: Element): ElementDetails {
  // Обработка списков
  if (element.matches('ul, ol, [role="list"]')) {
    return handleList(element);
  }

  // Обработка ссылок
  if (element.matches('a') && element instanceof HTMLAnchorElement) {
    return handleLink(element);
  }

  // Для всех остальных элементов используем базовую информацию
  return getBaseElementInfo(element);
}

export const LANDMARK_SELECTORS = 
  'nav, [role="navigation"], main, [role="main"], header, [role="banner"], ' +
  'footer, [role="contentinfo"], aside, [role="complementary"], ' +
  'section[aria-label], section[aria-labelledby], [role="region"][aria-label], ' +
  '[role="region"][aria-labelledby], form[aria-label], form[aria-labelledby], ' +
  '[role="form"], [role="search"]'; 