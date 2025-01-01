import { useEffect } from 'react';
import { VirtualBuffer } from '../virtualBuffer';
import { VirtualNode } from '../types';
import { speechService } from '../../../services/speech';

export function useKeyboardNavigation(
  virtualBuffer: VirtualBuffer | null,
  updateVisualFocus: (node: VirtualNode) => void,
  setIsActive: (active: boolean) => void,
  announceElement: (element: Element) => void
) {
  useEffect(() => {
    if (!virtualBuffer) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        const dialogResult = virtualBuffer.handleDialogNavigation('Escape');
        if (dialogResult) {
          updateVisualFocus(dialogResult);
          announceElement(dialogResult.element);
          return;
        }
        setIsActive(false);
        const toggleButton = document.querySelector('.screen-reader-toggle');
        if (toggleButton instanceof HTMLElement) {
          toggleButton.focus();
        }
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
      }

      if (nextNode) {
        updateVisualFocus(nextNode);
        announceElement(nextNode.element);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [virtualBuffer, updateVisualFocus, setIsActive, announceElement]);
} 