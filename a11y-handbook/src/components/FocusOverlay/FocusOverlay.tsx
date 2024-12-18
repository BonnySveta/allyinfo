import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Overlay = styled.div<{ $isActive: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  pointer-events: ${props => props.$isActive ? 'auto' : 'none'};
  opacity: ${props => props.$isActive ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const Spotlight = styled.div<{ $position: SpotlightPosition }>`
  position: absolute;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.85);
  border-radius: 8px;
  transition: all 0.3s ease;
  pointer-events: none;
  background: transparent;
  ${({ $position }) => `
    top: ${$position.top}px;
    left: ${$position.left}px;
    width: ${$position.width}px;
    height: ${$position.height}px;
  `}
`;

const ElementInfo = styled.div<{ $position: SpotlightPosition }>`
  position: fixed;
  top: ${props => props.$position.top + props.$position.height + 8}px;
  left: ${props => props.$position.left}px;
  background: var(--accent-color);
  color: white;
  padding: 12px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.4;
  min-width: 280px;
  max-width: 400px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
`;

const Role = styled.span`
  font-weight: bold;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Attributes = styled.span`
  opacity: 0.9;
  display: block;
  margin-top: 4px;
`;

const State = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 12px;
  display: inline-block;
  margin: 2px 4px;
`;

const Position = styled(State)`
  background: rgba(255, 255, 255, 0.3);
`;

const ShortcutInfo = styled.div`
  margin-top: 8px;
  font-size: 12px;
  opacity: 0.9;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Shortcut = styled.span`
  background: rgba(255, 255, 255, 0.15);
  padding: 4px 8px;
  border-radius: 3px;
  margin: 0 8px 8px 0;
  font-family: monospace;
  display: inline-block;
  white-space: nowrap;
`;

const LandmarkInfo = styled.span`
  background: rgba(var(--accent-color-rgb), 0.3);
  font-style: italic;
`;

const HeadingLevel = styled.span`
  background: rgba(var(--accent-color-rgb), 0.4);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  margin-left: 6px;
  font-weight: bold;
`;

const AriaAttribute = styled.span`
  background: rgba(255, 255, 255, 0.25);
  font-family: monospace;
`;

const ListInfo = styled.span`
  background: rgba(0, 120, 215, 0.3);
  font-weight: 500;
`;

const GlobalHints = styled.div<{ $isCollapsed: boolean }>`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: ${props => props.$isCollapsed ? '12px' : '20px'};
  border-radius: 8px;
  font-size: 14px;
  z-index: 10001;
  min-width: ${props => props.$isCollapsed ? '40px' : '280px'};
  max-width: ${props => props.$isCollapsed ? '40px' : '400px'};
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  pointer-events: none;
  
  * {
    pointer-events: auto;
  }
`;

const ButtonWrapper = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
  pointer-events: all;
  user-select: none;
`;

const CollapseButton = styled.div<{ $isCollapsed: boolean }>`
  background: transparent;
  color: var(--accent-color);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(${props => props.$isCollapsed ? '180deg' : '0deg'});
  transition: transform 0.3s ease;
  
  &:hover {
    color: white;
  }
`;

const HintsContent = styled.div<{ $isCollapsed: boolean }>`
  opacity: ${props => props.$isCollapsed ? 0 : 1};
  visibility: ${props => props.$isCollapsed ? 'hidden' : 'visible'};
  transition: all 0.3s ease;
`;

const CollapsedIndicator = styled.div`
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  color: var(--accent-color);
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const HintsSection = styled.div`
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const HintsTitle = styled.div`
  font-weight: bold;
  margin-bottom: 12px;
  color: var(--accent-color);
  font-size: 15px;
`;

interface SpotlightPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface ElementDetails {
  role: string;
  label?: string;
  level?: number;
  description?: string;
  states: string[];
  expanded?: boolean;
  pressed?: boolean;
  checked?: boolean;
  required?: boolean;
  current?: boolean | string;
  shortcuts?: string[];
  tabIndex?: number;
  isInteractive: boolean;
  position?: {
    current: number;
    total: number;
  };
  landmark?: string;
  region?: string;
  parentLandmarks?: string[];
}

function getElementInfo(element: Element): ElementDetails {
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

  // Собираем информацию об элементе
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

  // Также проверяем вложенные списки для определения уровня вложенности
  let parentList = element.closest('ul, ol, [role="list"], [role="menu"], [role="listbox"], [role="tablist"]');
  let nestingLevel = 0;
  
  while (parentList) {
    nestingLevel++;
    const parent = parentList.parentElement;
    parentList = parent ? parent.closest('ul, ol, [role="list"], [role="menu"], [role="listbox"], [role="tablist"]') : null;
  }

  if (nestingLevel > 1) {
    info.states.push(`level ${nestingLevel}`);
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

  // Проверяем наличие живого региона
  const live = element.getAttribute('aria-live');
  if (live) {
    const relevant = element.getAttribute('aria-relevant');
    const atomic = element.getAttribute('aria-atomic');
    
    info.states.push(`live region: ${live}`);
    if (relevant) info.states.push(`relevant: ${relevant}`);
    if (atomic) info.states.push(`atomic: ${atomic === 'true'}`);
  }

  // Улучшаем определение списков
  if (element.matches('ul, ol, [role="list"], [role="menu"], [role="listbox"]')) {
    const items = Array.from(element.children).filter(child => 
      child.matches('li, [role="listitem"], [role="menuitem"], [role="option"]')
    );
    
    if (items.length > 0) {
      info.states.push(`list with ${items.length} items`);
    }
  }

  // Улучшаем определение элементов списка
  if (element.matches('li, [role="listitem"], [role="menuitem"], [role="option"]')) {
    const parent = element.parentElement;
    if (parent) {
      const items = Array.from(parent.children).filter(child => 
        child.matches('li, [role="listitem"], [role="menuitem"], [role="option"]')
      );
      const currentIndex = items.indexOf(element);
      if (currentIndex !== -1) {
        info.position = {
          current: currentIndex + 1,
          total: items.length
        };
        // Изменяем формат отображения позиции
        info.states.push(`item ${currentIndex + 1} of ${items.length}`);
      }
    }
  }

  // Улучшаем определение навигации
  if (role === 'navigation') {
    const lists = Array.from(element.querySelectorAll('ul, ol, [role="list"], [role="menu"]'));
    lists.forEach(list => {
      const items = list.querySelectorAll('li, [role="listitem"], [role="menuitem"]');
      if (items.length > 0) {
        info.states.push(`contains list with ${items.length} items`);
      }
    });
  }

  return info;
}

export function FocusOverlay() {
  const [isActive, setIsActive] = useState(false);
  const [spotlightPosition, setSpotlightPosition] = useState<SpotlightPosition>({
    top: 0,
    left: 0,
    width: 0,
    height: 0
  });
  const [elementInfo, setElementInfo] = useState<ElementDetails | null>(null);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [virtualFocus, setVirtualFocus] = useState<Element | null>(null);
  const [navigationMode, setNavigationMode] = useState<'landmarks' | 'elements'>('elements');
  const [isHintsCollapsed, setIsHintsCollapsed] = useState(false);

  useEffect(() => {
    const handleFocusChange = () => {
      const focusedElement = virtualFocus || document.activeElement;
      
      if (focusedElement && isActive && focusedElement !== document.body) {
        const rect = focusedElement.getBoundingClientRect();
        const padding = 4;

        // Получаем высоту видимой области
        const viewportHeight = window.innerHeight;
        // Получаем текущую озицию скролла
        const currentScroll = document.body.style.top ? 
          parseInt(document.body.style.top) * -1 : 
          window.scrollY;

        // Проверяем, виден ли элемент полностью
        const elementTop = rect.top + currentScroll;
        const elementBottom = elementTop + rect.height;

        // Определяем оптимальную позицию скролла
        let newScrollY = currentScroll;

        // Если элемент выходит за нижнюю границу
        if (rect.bottom > viewportHeight - 100) { // 100px отступ снизу
          newScrollY = elementBottom - viewportHeight + 100;
        }
        // Если элемент выходит за верхнюю границу
        else if (rect.top < 100) { // 100px отступ сверху
          newScrollY = elementTop - 100;
        }

        // Обновляем позицию скролла и стили body
        if (newScrollY !== currentScroll) {
          document.body.style.top = `-${newScrollY}px`;
        }

        setSpotlightPosition({
          top: rect.top - padding,
          left: rect.left - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2
        });

        setElementInfo(getElementInfo(focusedElement));
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive) return;

      if (e.key === 'Escape') {
        setIsActive(false);
        setVirtualFocus(null);
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, lastScrollPosition);
        return;
      }

      // ереключение режима навигации
      if (e.key === 'F6') {
        e.preventDefault();
        setNavigationMode(prev => prev === 'landmarks' ? 'elements' : 'landmarks');
        return;
      }

      // Навигация по ориентирам
      if (navigationMode === 'landmarks' && e.key === 'Tab') {
        e.preventDefault();
        const landmarks = Array.from(document.querySelectorAll(
          'nav, [role="navigation"], main, [role="main"], header, [role="banner"], ' +
          'footer, [role="contentinfo"], aside, [role="complementary"], ' +
          'section[aria-label], section[aria-labelledby], [role="region"][aria-label], ' +
          '[role="region"][aria-labelledby], form[aria-label], form[aria-labelledby], ' +
          '[role="form"], [role="search"]'
        ));

        if (landmarks.length === 0) return;

        const currentElement = virtualFocus || document.activeElement;
        if (!currentElement) return;

        const currentIndex = landmarks.indexOf(currentElement);
        let nextIndex: number;

        if (e.shiftKey) {
          nextIndex = currentIndex === -1 ? 0 : 
            (currentIndex - 1 + landmarks.length) % landmarks.length;
        } else {
          nextIndex = currentIndex === -1 ? 0 : 
            (currentIndex + 1) % landmarks.length;
        }

        setVirtualFocus(landmarks[nextIndex]);
        handleFocusChange();
      }

      // В режиме элементов позволяем обычную Tab-навигацию
      if (navigationMode === 'elements' && virtualFocus) {
        setVirtualFocus(null); // Возвращаем контроль браузерному фокусу
      }
    };

    const handleToggleOverlay = () => {
      setIsActive(prev => {
        const newState = !prev;
        
        if (newState) {
          // Сохраняем текущую позицию скролла
          const scrollY = window.scrollY;
          setLastScrollPosition(scrollY);
          document.body.style.position = 'fixed';
          document.body.style.top = `-${scrollY}px`;
          document.body.style.width = '100%';
        } else {
          // Восстановим позицию скролла
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';
          window.scrollTo(0, lastScrollPosition);
        }
        
        if (!prev) {
          handleFocusChange();
        }
        return newState;
      });
    };

    // Создаем MutationObserver для отслеживания изменений атрибутов
    const observer = new MutationObserver((mutations) => {
      const focusedElement = document.activeElement;
      if (focusedElement && isActive && focusedElement !== document.body) {
        // Проверяем, что изенения произошли с текущим элементом в фокусе
        const hasRelevantMutation = mutations.some(mutation => 
          mutation.target === focusedElement && 
          mutation.type === 'attributes'
        );
        
        if (hasRelevantMutation) {
          setElementInfo(getElementInfo(focusedElement));
        }
      }
    });

    // Настраиваем observer для отслеживания изменений атрибут��в
    if (isActive) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['aria-pressed', 'aria-expanded', 'aria-checked', 'disabled', 'aria-hidden'],
        subtree: true
      });
    }

    document.addEventListener('focusin', handleFocusChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('toggleFocusOverlay', handleToggleOverlay);

    return () => {
      // Очищаем стили и восстанавливаем скролл при размонтировании
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, lastScrollPosition);
      
      document.removeEventListener('focusin', handleFocusChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('toggleFocusOverlay', handleToggleOverlay);
      observer.disconnect();
    };
  }, [isActive, lastScrollPosition, virtualFocus, navigationMode]);

  return (
    <Overlay $isActive={isActive}>
      {isActive && (
        <>
          <Spotlight $position={spotlightPosition} />
          
          {elementInfo && (
            <ElementInfo $position={spotlightPosition}>
              <Role>
                {elementInfo.role}
                {elementInfo.level && <HeadingLevel>H{elementInfo.level}</HeadingLevel>}
              </Role>
              {elementInfo.label && (
                <Attributes>
                  {elementInfo.label}
                  {elementInfo.description && ` (${elementInfo.description})`}
                </Attributes>
              )}
              {elementInfo.states?.length > 0 && elementInfo.states.map((state, index) => {
                if (state.includes(' of ')) {
                  return <Position key={index}>{state}</Position>;
                }
                if (state.startsWith('landmark:') || state.startsWith('region:') || state.startsWith('in ')) {
                  return <LandmarkInfo key={index}>{state}</LandmarkInfo>;
                }
                if (state.startsWith('heading level ')) {
                  return <HeadingLevel key={index}>{state}</HeadingLevel>;
                }
                if (state.startsWith('aria-')) {
                  return <AriaAttribute key={index}>{state}</AriaAttribute>;
                }
                if (state.includes('list with') || state.includes('item ')) {
                  return <ListInfo key={index}>{state}</ListInfo>;
                }
                return <State key={index}>{state}</State>;
              })}
              {elementInfo.isInteractive && elementInfo.shortcuts && (
                <ShortcutInfo>
                  {elementInfo.shortcuts.map((shortcut, index) => (
                    <Shortcut key={index}>{shortcut}</Shortcut>
                  ))}
                </ShortcutInfo>
              )}
            </ElementInfo>
          )}

          <GlobalHints 
            $isCollapsed={isHintsCollapsed}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isHintsCollapsed) {
                setIsHintsCollapsed(false);
              }
            }}
          >
            <ButtonWrapper
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsHintsCollapsed(!isHintsCollapsed);
              }}
            >
              <CollapseButton 
                $isCollapsed={isHintsCollapsed}
                role="presentation"
              >
                {isHintsCollapsed ? '←' : '→'}
              </CollapseButton>
            </ButtonWrapper>

            {isHintsCollapsed ? (
              <CollapsedIndicator>Подсказки</CollapsedIndicator>
            ) : (
              <HintsContent $isCollapsed={isHintsCollapsed}>
                <HintsSection>
                  <HintsTitle>Режим навигации ({navigationMode === 'landmarks' ? 'ориентиры' : 'элементы'})</HintsTitle>
                  <Shortcut>F6: переключить режим</Shortcut>
                </HintsSection>

                <HintsSection>
                  <HintsTitle>Навигация по ориентирам</HintsTitle>
                  {navigationMode === 'landmarks' ? (
                    <>
                      <Shortcut>Tab: следующий ориентир</Shortcut>
                      <Shortcut>Shift + Tab: предыдущий ориентир</Shortcut>
                    </>
                  ) : (
                    <Shortcut>F6: включить режим ориентиров</Shortcut>
                  )}
                </HintsSection>

                <HintsSection>
                  <HintsTitle>Навигация по заголовкам</HintsTitle>
                  <Shortcut>H: следующий заголовок</Shortcut>
                  <Shortcut>Shift + H: предыдущий заголовок</Shortcut>
                  <Shortcut>1-6: заголовок определенного уровня</Shortcut>
                </HintsSection>
              </HintsContent>
            )}
          </GlobalHints>
        </>
      )}
    </Overlay>
  );
}

export function useFocusOverlay() {
  const [overlayRef, setOverlayRef] = useState<HTMLDivElement | null>(null);

  const toggleOverlay = () => {
    if (overlayRef) {
      const isActive = overlayRef.style.opacity === '1';
      overlayRef.style.opacity = isActive ? '0' : '1';
      overlayRef.style.pointerEvents = isActive ? 'none' : 'auto';
    }
  };

  return { setOverlayRef, toggleOverlay };
} 