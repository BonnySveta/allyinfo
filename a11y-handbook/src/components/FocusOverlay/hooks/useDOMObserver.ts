import { useEffect } from 'react';
import { VirtualBuffer } from '../virtualBuffer';
import { VirtualNode } from '../types';

export function useDOMObserver(
  isActive: boolean,
  virtualBuffer: VirtualBuffer | null,
  updateVisualFocus: (node: VirtualNode) => void
) {
  useEffect(() => {
    if (!isActive || !virtualBuffer) return;

    // Наблюдатель за изменениями в DOM
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
        const newBuffer = virtualBuffer;
        const activeElement = document.activeElement || document.querySelector('.screen-reader-toggle');
        if (activeElement) {
          const node = newBuffer.setCurrentNode(activeElement);
          if (node) {
            updateVisualFocus(node);
          }
        }
      }
    });

    // Наблюдатель за состояниями элементов
    const stateObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'aria-pressed' &&
            mutation.target instanceof Element) {
          
          const currentNode = virtualBuffer.getCurrentNode();
          if (currentNode?.element === mutation.target) {
            updateVisualFocus(currentNode);
          }
        }
      });
    });

    // Наблюдатель за live regions
    const liveRegionObserver = new MutationObserver(() => {
      virtualBuffer.updateLiveRegions();
    });

    // Настраиваем наблюдателей
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    stateObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['aria-pressed'],
      subtree: true
    });

    liveRegionObserver.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['aria-live', 'aria-atomic', 'aria-relevant']
    });

    return () => {
      observer.disconnect();
      stateObserver.disconnect();
      liveRegionObserver.disconnect();
    };
  }, [isActive, virtualBuffer, updateVisualFocus]);
} 