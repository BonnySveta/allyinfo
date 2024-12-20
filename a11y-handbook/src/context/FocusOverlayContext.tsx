import React, { createContext, useContext, useState } from 'react';

interface FocusOverlayContextType {
  isActive: boolean;
  toggleOverlay: () => void;
}

const FocusOverlayContext = createContext<FocusOverlayContextType | undefined>(undefined);

export function FocusOverlayProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);

  const toggleOverlay = () => {
    setIsActive(prev => !prev);
  };

  return (
    <FocusOverlayContext.Provider value={{ isActive, toggleOverlay }}>
      {children}
    </FocusOverlayContext.Provider>
  );
}

export function useFocusOverlay() {
  const context = useContext(FocusOverlayContext);
  if (context === undefined) {
    throw new Error('useFocusOverlay must be used within a FocusOverlayProvider');
  }
  return context;
} 