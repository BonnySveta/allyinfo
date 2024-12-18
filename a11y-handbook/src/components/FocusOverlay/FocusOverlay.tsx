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
    states: []
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

  useEffect(() => {
    const handleFocusChange = () => {
      const focusedElement = document.activeElement;
      
      if (focusedElement && isActive && focusedElement !== document.body) {
        const rect = focusedElement.getBoundingClientRect();
        const padding = 4;

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
      }
    };

    const handleToggleOverlay = () => {
      setIsActive(prev => !prev);
      if (!isActive) {
        handleFocusChange();
      }
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
      document.removeEventListener('focusin', handleFocusChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('toggleFocusOverlay', handleToggleOverlay);
      observer.disconnect();
    };
  }, [isActive]);

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
              {elementInfo.states?.length > 0 && elementInfo.states.map((state, index) => (
                <State key={index}>{state}</State>
              ))}
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