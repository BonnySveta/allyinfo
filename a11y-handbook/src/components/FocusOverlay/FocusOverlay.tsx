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

  const getElementBounds = useCallback((element: Element) => {
    const rect = element.getBoundingClientRect();
    const padding = 8;

    const formGroup = element.closest('.sc-edmcci');
    
    let bounds;
    if (formGroup) {
      const groupRect = formGroup.getBoundingClientRect();
      bounds = {
        left: groupRect.left - padding,
        top: groupRect.top - padding,
        width: groupRect.width + (padding * 2),
        height: groupRect.height + (padding * 2)
      };
    } else {
      bounds = {
        left: rect.left - padding,
        top: rect.top - padding,
        width: rect.width + (padding * 2),
        height: rect.height + (padding * 2)
      };
    }

    if (element instanceof HTMLElement) {
      const selectElement = element.tagName === 'SELECT' ? 
        element : 
        element.querySelector('select');

      if (selectElement) {
        const selectRect = selectElement.getBoundingClientRect();
        bounds.height = Math.max(bounds.height, selectRect.height + (padding * 4));
      }
    }

    return bounds;
  }, []);

  const updateVisualFocus = useCallback((node: VirtualNode) => {
    const element = node.element;
    const bounds = getElementBounds(element);
    
    const position = {
      top: bounds.top,
      left: bounds.left,
      width: bounds.width,
      height: bounds.height
    };
    
    setSpotlightPosition(position);

    const info = getElementInfo(element);
    setElementInfo(info);

    if (info.screenReaderText) {
      const [screenReaderText] = info.screenReaderText.split('\n');
      if (screenReaderText) {
        speechService.speak(screenReaderText);
      }
    }

    if (info.isFocusable && element instanceof HTMLElement) {
      element.focus();
    }
  }, [getElementBounds]);

  useEffect(() => {
    if (isActive) {
      const buffer = initializeBuffer();
      
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

      setLastScrollPosition(window.scrollY);
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = '100%';

      const activeElement = document.activeElement || document.querySelector('.screen-reader-toggle');
      if (activeElement) {
        const node = buffer.setCurrentNode(activeElement);
        if (node) {
          updateVisualFocus(node);
        }
      }

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
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, lastScrollPosition);
      speechService.stop();
    }
  }, [isActive, initializeBuffer, lastScrollPosition, updateVisualFocus]);

  useEffect(() => {
    if (!isActive || !virtualBuffer) return;

    const stateObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'aria-pressed' &&
            mutation.target instanceof Element) {
          
          const currentNode = virtualBuffer.getCurrentNode();
          if (currentNode?.element === mutation.target) {
            const info = getElementInfo(currentNode.element);
            setElementInfo(info);
          }
        }
      });
    });

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
        const dialogResult = virtualBuffer.handleDialogNavigation('Escape');
        if (dialogResult) {
          updateVisualFocus(dialogResult);
          return;
        }
        setIsActive(false);
        const toggleButton = document.querySelector('.screen-reader-toggle');
        if (toggleButton instanceof HTMLElement) {
          toggleButton.focus();
        }
        return;
      }

      if (e.key === 'F6') {
        e.preventDefault();
        setNavigationMode(prev => prev === 'landmarks' ? 'elements' : 'landmarks');
        return;
      }

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

        case 'd':
          e.preventDefault();
          nextNode = e.shiftKey ? 
            virtualBuffer.moveToPreviousByRole('dialog') : 
            virtualBuffer.moveToNextByRole('dialog');
          break;

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

