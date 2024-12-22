import { useState, useEffect, Fragment, useCallback } from 'react';
import { Spotlight, FlowIndicator, FlowLabel } from './styles';
import { SpotlightPosition, ElementDetails, NavigationMode, VirtualNode, FlowConnection } from './types';
import { getElementInfo, LANDMARK_SELECTORS } from './utils';
import { GlobalHints } from './components/GlobalHints';
import { ElementInfoDisplay } from './components/ElementInfoDisplay';
import { useFocusOverlay } from '../../context/FocusOverlayContext';
import { speechService } from '../../services/speech';
import { useLocation } from 'react-router-dom';

export function FocusOverlay() {
  const { 
    isActive, 
    setIsActive, 
    virtualBuffer, 
    initializeBuffer
  } = useFocusOverlay();
  const [spotlightPosition, setSpotlightPosition] = useState<SpotlightPosition>({
    top: 0, left: 0, width: 0, height: 0
  });
  const [elementInfo, setElementInfo] = useState<ElementDetails | null>(null);
  const [navigationMode, setNavigationMode] = useState<NavigationMode>('elements');
  const [isHintsCollapsed, setIsHintsCollapsed] = useState(false);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [flowConnections, setFlowConnections] = useState<FlowConnection[]>([]);
  const location = useLocation();

  const updateVisualFocus = useCallback((node: VirtualNode) => {
    const element = node.element;
    const rect = element.getBoundingClientRect();

    const position = {
      top: rect.top - 4,
      left: rect.left - 4,
      width: rect.width + 8,
      height: rect.height + 8
    };
    
    setSpotlightPosition(position);

    const info = getElementInfo(element);
    setElementInfo(info);

    // Озвучиваем текст для скринридера всегда, когда режим активен
    if (info.screenReaderText) {
      const [screenReaderText] = info.screenReaderText.split('\n');
      if (screenReaderText) {
        speechService.speak(screenReaderText);
      }
    }

    // Перемещаем реальный фокус только если элемент фокусируемый
    if (info.isFocusable && element instanceof HTMLElement) {
      element.focus();
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      const buffer = initializeBuffer();
      
      // Установим начальный элемент фокуса
      const activeElement = document.activeElement || document.querySelector('.screen-reader-toggle');
      if (activeElement) {
        const node = buffer.setCurrentNode(activeElement);
        if (node) {
          updateVisualFocus(node);
        }
      }
    }
  }, [location, isActive, initializeBuffer, updateVisualFocus]);

  useEffect(() => {
    if (isActive) {
      const buffer = initializeBuffer();

      // Сохраняем текущую позицию скролла
      setLastScrollPosition(window.scrollY);
      // Блокируем скролл
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = '100%';

      // Установим начальный элемент фокуса
      const activeElement = document.activeElement || document.querySelector('.screen-reader-toggle');
      if (activeElement) {
        const node = buffer.setCurrentNode(activeElement);
        if (node) {
          updateVisualFocus(node);
        }
      }

      // Наблюдаем за изменениями в DOM
      const observer = new MutationObserver((mutations) => {
        const significantChange = mutations.some(mutation => 
          mutation.type === 'childList' && 
          Array.from(mutation.addedNodes).some(node => 
            node instanceof Element && 
            (node.matches('main, article, section') || 
             node.querySelector('main, article, section'))
          )
        );

        if (significantChange) {
          const newBuffer = initializeBuffer();
          const activeElement = document.activeElement || document.querySelector('.screen-reader-toggle');
          if (activeElement) {
            const node = newBuffer.setCurrentNode(activeElement);
            if (node) {
              updateVisualFocus(node);
            }
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      return () => {
        observer.disconnect();
      };
    } else {
      // Восстанавливаем скролл
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, lastScrollPosition);
      // Останавливаем озвучку при выключении режима
      speechService.stop();
    }
  }, [isActive, initializeBuffer, lastScrollPosition, updateVisualFocus]);

  useEffect(() => {
    if (!isActive || !virtualBuffer) return;

    // Создаем MutationObserver для отслеживания изменений состояний
    const stateObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'aria-pressed' &&
            mutation.target instanceof Element) {
          
          // Используем публичный метод getCurrentNode() вместо прямого доступа к currentNode
          const currentNode = virtualBuffer.getCurrentNode();
          if (currentNode?.element === mutation.target) {
            // Обновляем информацию об элементе
            const info = getElementInfo(currentNode.element);
            setElementInfo(info);
          }
        }
      });
    });

    // Начинаем наблюдение за вем документом
    stateObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['aria-pressed'],
      subtree: true
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!virtualBuffer) {
        console.warn('No virtual buffer available');
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        // Сначала пробуем обработать навигацию в диалоге
        const dialogResult = virtualBuffer.handleDialogNavigation('Escape');
        if (dialogResult) {
          updateVisualFocus(dialogResult);
          return;
        }
        // Если не в диалоге, выходим из режима
        setIsActive(false);
        const toggleButton = document.querySelector('.screen-reader-toggle');
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

      // Навигация по flow-связям (F1)
      if (e.key === 'F1') {
        e.preventDefault();
        const flowResult = virtualBuffer.handleDialogNavigation('F1');
        if (flowResult) {
          updateVisualFocus(flowResult);
          return;
        }
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

        // Добавляем навигацию по диалогам
        case 'd':
          e.preventDefault();
          nextNode = e.shiftKey ? 
            virtualBuffer.moveToPreviousByRole('dialog') : 
            virtualBuffer.moveToNextByRole('dialog');
          break;

        // Навигация по flow-связям с помощью стрелок
        case 'ArrowRight':
          if (e.altKey) {
            e.preventDefault();
            nextNode = virtualBuffer.moveToFlowTarget();
          }
          break;
      }

      if (nextNode) {
        updateVisualFocus(nextNode);
      }
    };

    // Доб��вляем обработчик изменений для live regions
    const observer = new MutationObserver(() => {
      virtualBuffer.updateLiveRegions();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['aria-live', 'aria-atomic', 'aria-relevant']
    });

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
      stateObserver.disconnect();
    };
  }, [isActive, virtualBuffer, setIsActive]);

  return (
    <>
      {isActive && (
        <>
          <Spotlight 
            $position={spotlightPosition}
            $isModal={elementInfo?.isModal}
            $isLive={elementInfo?.isLiveRegion}
            $hasFlow={flowConnections.length > 0}
          />
          {flowConnections.map((connection, index) => (
            <Fragment key={index}>
              <FlowIndicator $from={connection.from} $to={connection.to} />
              <FlowLabel style={{
                left: (connection.from.left + connection.to.left) / 2,
                top: (connection.from.top + connection.to.top) / 2
              }}>
                {connection.label}
              </FlowLabel>
            </Fragment>
          ))}
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

