import { useState, useEffect } from 'react';
import { Spotlight } from './styles';
import { NavigationMode, FlowConnection } from './types';
import { GlobalHints } from './components/GlobalHints';
import { ElementInfoDisplay } from './components/ElementInfoDisplay';
import { FlowConnections } from './components/FlowConnections';
import { useFocusOverlay } from '../../context/FocusOverlayContext';
import { useLocation } from 'react-router-dom';
import { useSpotlight } from './hooks/useSpotlight';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { useDOMObserver } from './hooks/useDOMObserver';
import { useScrollLock } from './hooks/useScrollLock';
import { speechService } from '../../services/speech';

export function FocusOverlay() {
  const { isActive, setIsActive, virtualBuffer, initializeBuffer } = useFocusOverlay();
  const { spotlightPosition, elementInfo, updateVisualFocus } = useSpotlight();
  const [navigationMode, setNavigationMode] = useState<NavigationMode>('elements');
  const [isHintsCollapsed, setIsHintsCollapsed] = useState(false);
  const [flowConnections, setFlowConnections] = useState<FlowConnection[]>([]);
  const location = useLocation();

  // Используем выделенные хуки
  useKeyboardNavigation(virtualBuffer, updateVisualFocus, setIsActive);
  useDOMObserver(isActive, virtualBuffer, updateVisualFocus);
  useScrollLock(isActive);

  // Добавляем эффект для остановки озвучки при деактивации
  useEffect(() => {
    if (!isActive) {
      speechService.stop();
    }
  }, [isActive]);

  // Инициализация при изменении маршрута
  useEffect(() => {
    if (isActive) {
      const buffer = initializeBuffer();
      const activeElement = document.activeElement || document.querySelector('.screen-reader-toggle');
      if (activeElement) {
        const node = buffer.setCurrentNode(activeElement);
        if (node) updateVisualFocus(node);
      }
    }
  }, [location, isActive, initializeBuffer, updateVisualFocus]);

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
          <FlowConnections connections={flowConnections} />
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

