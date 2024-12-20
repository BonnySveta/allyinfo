import { useState, useEffect } from 'react';
import { Overlay, Spotlight } from './styles';
import { SpotlightPosition, ElementDetails, NavigationMode } from './types';
import { getElementInfo, LANDMARK_SELECTORS } from './utils';
import { GlobalHints } from './components/GlobalHints';
import { ElementInfoDisplay } from './components/ElementInfoDisplay';
import { useFocusOverlay } from '../../context/FocusOverlayContext';

export function FocusOverlay() {
  const { isActive, setIsActive } = useFocusOverlay();
  const [spotlightPosition, setSpotlightPosition] = useState<SpotlightPosition>({
    top: 0,
    left: 0,
    width: 0,
    height: 0
  });
  const [elementInfo, setElementInfo] = useState<ElementDetails | null>(null);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [virtualFocus, setVirtualFocus] = useState<Element | null>(null);
  const [navigationMode, setNavigationMode] = useState<NavigationMode>('elements');
  const [isHintsCollapsed, setIsHintsCollapsed] = useState(false);

  useEffect(() => {
    const handleFocusChange = () => {
      const focusedElement = virtualFocus || document.activeElement;
      
      if (focusedElement && isActive && focusedElement !== document.body) {
        const rect = focusedElement.getBoundingClientRect();
        const padding = 4;

        // Получаем высоту видимой области
        const viewportHeight = window.innerHeight;
        const currentScroll = document.body.style.top ? 
          parseInt(document.body.style.top) * -1 : 
          window.scrollY;

        // Проверяем, виден ли элемент полностью
        const elementTop = rect.top + currentScroll;
        const elementBottom = elementTop + rect.height;

        // Определяем оптимальную позицию скролла
        let newScrollY = currentScroll;

        if (rect.bottom > viewportHeight - 100) {
          newScrollY = elementBottom - viewportHeight + 100;
        }
        else if (rect.top < 100) {
          newScrollY = elementTop - 100;
        }

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

      // Добавляем выход по Esc
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsActive(false);
        // Возвращаем фокус на кнопку включения режима, если она существует
        const toggleButton = document.querySelector('[aria-label="Имитация скринридера"]');
        if (toggleButton instanceof HTMLElement) {
          toggleButton.focus();
        }
        return;
      }

      // Обработка Tab/Shift+Tab для навигации
      if (e.key === 'Tab') {
        e.preventDefault();
        
        // Получаем все интерактивные элементы в правильном порядке документа
        const interactiveElements = Array.from(document.querySelectorAll(
          'a, button, input, select, textarea, [tabindex="0"], nav, ul'
        )).filter(el => {
          // Фильтруем только видимые элементы
          const style = window.getComputedStyle(el);
          return style.display !== 'none' && style.visibility !== 'hidden';
        });

        const currentElement = virtualFocus || document.activeElement;
        let currentIndex = interactiveElements.indexOf(currentElement as Element);
        
        // Если мы начинаем с кнопки "Имитация скринридера" и идем назад
        if (currentIndex === -1 && e.shiftKey) {
          // Находим последний элемент в навигации
          const lastNavItem = interactiveElements[interactiveElements.length - 1];
          setVirtualFocus(lastNavItem);
          handleFocusChange();
          return;
        }

        // Обычная навигация
        let nextIndex: number;
        if (e.shiftKey) {
          nextIndex = currentIndex === -1 ? interactiveElements.length - 1 : 
            (currentIndex - 1 + interactiveElements.length) % interactiveElements.length;
        } else {
          nextIndex = currentIndex === -1 ? 0 : 
            (currentIndex + 1) % interactiveElements.length;
        }

        const nextElement = interactiveElements[nextIndex];

        // Если следующий элемент нативно фокусируемый - используем реальный фокус
        if (nextElement instanceof HTMLElement && 
            (nextElement.tagName === 'A' || 
             nextElement.tagName === 'BUTTON' || 
             nextElement.tagName === 'INPUT' || 
             nextElement.tagName === 'SELECT' || 
             nextElement.tagName === 'TEXTAREA' ||
             nextElement.hasAttribute('tabindex'))) {
          setVirtualFocus(null);
          nextElement.focus();
        } else {
          // Иначе используем виртуальный фокус
          setVirtualFocus(nextElement);
        }
        
        handleFocusChange();
      }

      // Переключение режима навигации
      if (e.key === 'F6') {
        e.preventDefault();
        setNavigationMode(prev => prev === 'landmarks' ? 'elements' : 'landmarks');
        return;
      }

      // Навигация по ориентирам
      if (navigationMode === 'landmarks' && e.key === 'Tab') {
        e.preventDefault();
        const landmarks = Array.from(document.querySelectorAll(LANDMARK_SELECTORS));

        if (landmarks.length === 0) return;

        const currentElement = virtualFocus || document.activeElement;
        if (!currentElement) return;

        const currentIndex = landmarks.indexOf(currentElement);
        let nextIndex = e.shiftKey ? 
          (currentIndex - 1 + landmarks.length) % landmarks.length :
          (currentIndex + 1) % landmarks.length;

        setVirtualFocus(landmarks[nextIndex]);
        handleFocusChange();
      }

      if (navigationMode === 'elements' && virtualFocus) {
        setVirtualFocus(null);
      }

      // Навигация по заголовкам
      if (e.key.toLowerCase() === 'h') {
        e.preventDefault();
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        if (headings.length === 0) return;

        const currentElement = virtualFocus || document.activeElement;
        const currentIndex = headings.indexOf(currentElement as Element);
        let nextIndex: number;

        if (e.shiftKey) {
          // Предыдущий заголовок
          nextIndex = currentIndex === -1 ? headings.length - 1 : 
            (currentIndex - 1 + headings.length) % headings.length;
        } else {
          // Следующий заголовок
          nextIndex = currentIndex === -1 ? 0 : 
            (currentIndex + 1) % headings.length;
        }

        setVirtualFocus(headings[nextIndex]);
        handleFocusChange();
        return;
      }

      // Нвигация по уровням заголовков
      const headingLevel = parseInt(e.key);
      if (headingLevel >= 1 && headingLevel <= 6) {
        e.preventDefault();
        const headings = Array.from(document.querySelectorAll(`h${headingLevel}`));
        if (headings.length === 0) return;

        const currentElement = virtualFocus || document.activeElement;
        const currentIndex = headings.indexOf(currentElement as Element);
        const nextIndex = currentIndex === -1 ? 0 : 
          (currentIndex + 1) % headings.length;

        setVirtualFocus(headings[nextIndex]);
        handleFocusChange();
      }

      // Добавим навигацию по спискам
      if (e.key === 'l') {
        e.preventDefault();
        const lists = Array.from(document.querySelectorAll('ul, ol, [role="list"]'));
        if (lists.length === 0) return;

        const currentElement = virtualFocus || document.activeElement;
        const currentIndex = lists.indexOf(currentElement as Element);
        let nextIndex: number;

        if (e.shiftKey) {
          nextIndex = currentIndex === -1 ? lists.length - 1 : 
            (currentIndex - 1 + lists.length) % lists.length;
        } else {
          nextIndex = currentIndex === -1 ? 0 : 
            (currentIndex + 1) % lists.length;
        }

        setVirtualFocus(lists[nextIndex]);
        handleFocusChange();
      }
    };

    // Настраиваем observer для отслеживания изменений атрибутов
    const observer = new MutationObserver((mutations) => {
      const focusedElement = document.activeElement;
      if (focusedElement && isActive && focusedElement !== document.body) {
        const hasRelevantMutation = mutations.some(mutation => 
          mutation.target === focusedElement && 
          mutation.type === 'attributes'
        );
        
        if (hasRelevantMutation) {
          setElementInfo(getElementInfo(focusedElement));
        }
      }
    });

    if (isActive) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['aria-pressed', 'aria-expanded', 'aria-checked', 'disabled', 'aria-hidden'],
        subtree: true
      });
      
      document.addEventListener('focusin', handleFocusChange);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('focusin', handleFocusChange);
      document.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
    };
  }, [isActive, lastScrollPosition, virtualFocus, navigationMode, setIsActive]);

  return (
    <Overlay $isActive={isActive}>
      {isActive && (
        <>
          <Spotlight $position={spotlightPosition} />
          {elementInfo && (
            <ElementInfoDisplay 
              elementInfo={elementInfo} 
              position={spotlightPosition} 
            />
          )}
          <GlobalHints 
            navigationMode={navigationMode}
            isCollapsed={isHintsCollapsed}
            onToggleCollapse={() => setIsHintsCollapsed(!isHintsCollapsed)}
          />
        </>
      )}
    </Overlay>
  );
}

