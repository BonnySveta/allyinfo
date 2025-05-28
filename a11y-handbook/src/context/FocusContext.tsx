import { createContext, useState } from "react";

interface FocusContextType {
  focusRef: HTMLAnchorElement | null | undefined;
  setFocusRef: (ref: HTMLAnchorElement | undefined) => void;
}

export const FocusContext = createContext<FocusContextType>({
  focusRef: null,
  setFocusRef: () => { },
});

export function FocusProvider({ children }: { children: React.ReactNode }) {
  const [focusRef, setFocusRef] = useState<HTMLAnchorElement>();

  return (
    <FocusContext.Provider value={{ focusRef, setFocusRef }}>
      {children}
    </FocusContext.Provider>
    );
}