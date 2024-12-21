import { useState, useEffect } from 'react';
import { Spotlight } from './styles';
import { SpotlightPosition, ElementDetails, NavigationMode, VirtualNode } from './types';
import { getElementInfo, LANDMARK_SELECTORS } from './utils';
import { GlobalHints } from './components/GlobalHints';
import { ElementInfoDisplay } from './components/ElementInfoDisplay';
import { useFocusOverlay } from '../../context/FocusOverlayContext';

export function FocusOverlay() {
  const { isActive, setIsActive, virtualBuffer, initializeBuffer } = useFocusOverlay();
  const [spotlightPosition, setSpotlightPosition] = useState<SpotlightPosition>({
    top: 0, left: 0, width: 0, height: 0
  });
  const [elementInfo, setElementInfo] = useState<ElementDetails | null>(null);
  const [navigationMode, setNavigationMode] = useState<NavigationMode>('elements');
  const [isHintsCollapsed, setIsHintsCollapsed] = useState(false);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);

  useEffect(() => {
    if (isActive) {
      const buffer = initializeBuffer();
      
      // Установим начальный элемент фокуса
      const activeElement = document.activeElement || document.body;
      const node = buffer.setCurrentNode(activeElement);
      if (node) {
        updateVisualFocus(node);
      }

      // Сохр��няем текущую позицию скролла
      setLastScrollPosition(window.scrollY);
      // Блокируем скролл
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Восстанавливаем скролл
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, lastScrollPosition);
    }
  }, [isActive, initializeBuffer, lastScrollPosition]);

  const updateVisualFocus = (node: VirtualNode) => {
    const element = node.element;
    const rect = element.getBoundingClientRect();
    const padding = 4;

    // Обновляем позицию спотлайта
    setSpotlightPosition({
      top: rect.top - padding,
      left: rect.left - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2
    });

    // Получаем и устанавливаем информацию об элементе
    const info = getElementInfo(element);
    console.log('Element info:', info); // Добавим для отладки
    setElementInfo(info);
  };

  useEffect(() => {
    if (!isActive || !virtualBuffer) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsActive(false);
        // Возвращаем фокус на кнопку включения режима
        const toggleButton = document.querySelector('[aria-label="Имитация скринридера"]');
        if (toggleButton instanceof HTMLElement) {
          toggleButton.focus();
        }
        return;
      }

      // Переключение режима навигации
      if (e.key === 'F6') {
        e.preventDefault();
        setNavigationMode(prev => prev === 'landmarks' ? 'elements' : 'landmarks');
        return;
      }

      let nextNode: VirtualNode | null = null;

      switch (e.key) {
        case 'Tab':
          e.preventDefault();
          nextNode = e.shiftKey ? 
            virtualBuffer.movePrevious() : 
            virtualBuffer.moveNext();
          break;

        case 'h':
          e.preventDefault();
          nextNode = e.shiftKey ? 
            virtualBuffer.moveToPreviousByRole('heading') : 
            virtualBuffer.moveToNextByRole('heading');
          break;

        case 'l':
          e.preventDefault();
          nextNode = e.shiftKey ? 
            virtualBuffer.moveToPreviousByRole('list') : 
            virtualBuffer.moveToNextByRole('list');
          break;

        // Добавьте другие клавиши навигации по необходимости
      }

      if (nextNode) {
        updateVisualFocus(nextNode);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, virtualBuffer, setIsActive]);

  return (
    <>
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
    </>
  );
}

