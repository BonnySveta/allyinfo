import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FocusOverlayContextType } from '../types/context';

const FocusOverlayContext = createContext<FocusOverlayContextType>({
  isActive: false,
  setIsActive: () => {},
});

export function FocusOverlayProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);

  return (
    <FocusOverlayContext.Provider value={{ isActive, setIsActive }}>
      {children}
    </FocusOverlayContext.Provider>
  );
}

export function useFocusOverlay() {
  const context = useContext(FocusOverlayContext);
  if (!context) {
    throw new Error('useFocusOverlay must be used within a FocusOverlayProvider');
  }
  return context;
} 