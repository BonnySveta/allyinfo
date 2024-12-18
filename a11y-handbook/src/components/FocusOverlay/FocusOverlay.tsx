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

const ElementInfo = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: var(--accent-color);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  z-index: 10000;
`;

const Role = styled.span`
  font-weight: bold;
  text-transform: uppercase;
`;

const Attributes = styled.span`
  margin-left: 8px;
  opacity: 0.9;
`;

const State = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  margin-left: 6px;
`;

const Position = styled(State)`
  background: rgba(255, 255, 255, 0.3);
`;

const ShortcutInfo = styled.div`
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.9;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 4px;
`;

const Shortcut = styled.span`
  background: rgba(255, 255, 255, 0.15);
  padding: 2px 4px;
  border-radius: 3px;
  margin-right: 8px;
  font-family: monospace;
`;

const LandmarkInfo = styled(State)`
  background: rgba(var(--accent-color-rgb), 0.3);
  font-style: italic;
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
    info.level = parseInt(element.tagName[1]);
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

  // Добавляем ��роверку позиции в списке
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

  useEffect(() => {
    const handleFocusChange = () => {
      const focusedElement = document.activeElement;
      
      if (focusedElement && isActive && focusedElement !== document.body) {
        const rect = focusedElement.getBoundingClientRect();
        const padding = 4;

        // Получаем высоту видимой области
        const viewportHeight = window.innerHeight;
        // Получаем текущую позицию скролла
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
      if (e.key === 'Escape' && isActive) {
        setIsActive(false);
        // Восстанавливаем скролл при выходе по Escape
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, lastScrollPosition);
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
          // Восстанавливаем позицию скролла
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
        // Проверяем, что изменения произошли с текущим элементом в фокусе
        const hasRelevantMutation = mutations.some(mutation => 
          mutation.target === focusedElement && 
          mutation.type === 'attributes'
        );
        
        if (hasRelevantMutation) {
          setElementInfo(getElementInfo(focusedElement));
        }
      }
    });

    // Настраиваем observer для отслеживания изменений атрибутов
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
  }, [isActive, lastScrollPosition]);

  return (
    <Overlay $isActive={isActive}>
      {isActive && (
        <Spotlight $position={spotlightPosition}>
          {elementInfo && (
            <ElementInfo>
              <Role>
                {elementInfo.role}
                {elementInfo.level ? ` ${elementInfo.level}` : ''}
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
                return <State key={index}>{state}</State>;
              })}
              {elementInfo.isInteractive && (
                <ShortcutInfo>
                  <div>
                    {elementInfo.tabIndex !== undefined && elementInfo.tabIndex >= 0 && (
                      <Shortcut>Tab: navigate</Shortcut>
                    )}
                    {elementInfo.shortcuts?.map((shortcut, index) => (
                      <Shortcut key={index}>{shortcut}</Shortcut>
                    ))}
                  </div>
                </ShortcutInfo>
              )}
            </ElementInfo>
          )}
        </Spotlight>
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