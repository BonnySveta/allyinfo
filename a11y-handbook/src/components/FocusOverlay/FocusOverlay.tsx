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
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7);
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

interface SpotlightPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function FocusOverlay() {
  const [isActive, setIsActive] = useState(false);
  const [spotlightPosition, setSpotlightPosition] = useState<SpotlightPosition>({
    top: 0,
    left: 0,
    width: 0,
    height: 0
  });

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

    document.addEventListener('focusin', handleFocusChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('toggleFocusOverlay', handleToggleOverlay);

    return () => {
      document.removeEventListener('focusin', handleFocusChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('toggleFocusOverlay', handleToggleOverlay);
    };
  }, [isActive]);

  return (
    <Overlay $isActive={isActive}>
      {isActive && <Spotlight $position={spotlightPosition} />}
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