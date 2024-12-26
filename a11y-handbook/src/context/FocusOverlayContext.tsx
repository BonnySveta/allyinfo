import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { VirtualBuffer } from '../components/FocusOverlay/virtualBuffer';
import { VirtualNode } from '../components/FocusOverlay/types';
import { speechService } from '../services/speech';

interface FocusOverlayState {
  isActive: boolean;
  virtualBuffer: VirtualBuffer | null;
  currentNode: VirtualNode | null;
  navigationMode: 'elements' | 'landmarks';
}

interface FocusOverlayContextType extends FocusOverlayState {
  setIsActive: (active: boolean) => void;
  initializeBuffer: () => VirtualBuffer;
  setCurrentNode: (node: VirtualNode | null) => void;
  setNavigationMode: (mode: 'elements' | 'landmarks') => void;
  announceElement: (node: VirtualNode) => void;
  announceUpdate: (message: string) => void;
}

const initialState: FocusOverlayState = {
  isActive: false,
  virtualBuffer: null,
  currentNode: null,
  navigationMode: 'elements'
};

const FocusOverlayContext = createContext<FocusOverlayContextType>({
  ...initialState,
  setIsActive: () => {},
  initializeBuffer: () => { throw new Error('Not implemented') },
  setCurrentNode: () => {},
  setNavigationMode: () => {},
  announceElement: () => {},
  announceUpdate: () => {}
});

export function FocusOverlayProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FocusOverlayState>(initialState);

  const setIsActive = useCallback((active: boolean) => {
    setState(prev => ({ ...prev, isActive: active }));
  }, []);

  const initializeBuffer = useCallback(() => {
    const newBuffer = new VirtualBuffer(document);
    setState(prev => ({ ...prev, virtualBuffer: newBuffer }));
    return newBuffer;
  }, []);

  const setCurrentNode = useCallback((node: VirtualNode | null) => {
    setState(prev => ({ ...prev, currentNode: node }));
  }, []);

  const setNavigationMode = useCallback((mode: 'elements' | 'landmarks') => {
    setState(prev => ({ ...prev, navigationMode: mode }));
  }, []);

  const announceElement = useCallback((node: VirtualNode) => {
    if (!node.screenReaderText) return;

    const [mainText, technicalInfo] = node.screenReaderText.split('\n');
    
    // Всегда озвучиваем основной текст
    if (mainText) {
      speechService.speak(mainText);
    }

    // Озвучиваем техническую информацию только в режиме разработчика
    if (process.env.NODE_ENV === 'development' && technicalInfo) {
      setTimeout(() => {
        speechService.speak(technicalInfo);
      }, 100);
    }
  }, []);

  const announceUpdate = useCallback((message: string) => {
    // Если режим скринридера активен и есть виртуальный буфер
    if (state.isActive && state.virtualBuffer) {
      // Сначала пересоздаем буфер
      const newBuffer = new VirtualBuffer(document);
      setState(prev => ({ ...prev, virtualBuffer: newBuffer }));

      // Обновляем текущий узел
      const activeElement = document.activeElement || document.querySelector('.screen-reader-toggle');
      if (activeElement) {
        const node = newBuffer.setCurrentNode(activeElement);
        if (node) {
          setState(prev => ({ ...prev, currentNode: node }));
        }
      }

      // Даем небольшую задержку перед озвучкой
      setTimeout(() => {
        // Останавливаем предыдущую озвучку
        speechService.stop();
        // Озвучиваем новое сообщение
        speechService.speak(message, { priority: 'low' });
      }, 100);
    } else {
      // Если скринридер не активен, просто озвучиваем
      speechService.speak(message, { priority: 'low' });
    }
  }, [state.isActive, state.virtualBuffer]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      speechService.stop();
      setState(initialState);
    };
  }, []);

  const contextValue = {
    ...state,
    setIsActive,
    initializeBuffer,
    setCurrentNode,
    setNavigationMode,
    announceElement,
    announceUpdate
  };

  return (
    <FocusOverlayContext.Provider value={contextValue}>
      {children}
    </FocusOverlayContext.Provider>
  );
}

export const useFocusOverlay = () => {
  const context = useContext(FocusOverlayContext);
  if (!context) {
    throw new Error('useFocusOverlay must be used within FocusOverlayProvider');
  }
  return context;
}; 