import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { VirtualBuffer } from '../components/FocusOverlay/virtualBuffer';

interface FocusOverlayContextType {
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  virtualBuffer: VirtualBuffer | null;
  initializeBuffer: () => VirtualBuffer;
}

const FocusOverlayContext = createContext<FocusOverlayContextType>({
  isActive: false,
  setIsActive: () => {},
  virtualBuffer: null,
  initializeBuffer: () => { throw new Error('Not implemented') },
});

export function FocusOverlayProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [virtualBuffer, setVirtualBuffer] = useState<VirtualBuffer | null>(null);

  const initializeBuffer = useCallback(() => {
    const newBuffer = new VirtualBuffer(document);
    setVirtualBuffer(newBuffer);
    return newBuffer;
  }, []);

  return (
    <FocusOverlayContext.Provider 
      value={{ 
        isActive, 
        setIsActive, 
        virtualBuffer,
        initializeBuffer
      }}
    >
      {children}
    </FocusOverlayContext.Provider>
  );
}

export const useFocusOverlay = () => useContext(FocusOverlayContext); 