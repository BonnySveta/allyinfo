// Типы и интерфейсы
export interface SpotlightPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface ElementPosition {
  current: number;
  total: number;
}

export interface ElementDetails {
  role: string;
  label?: string;
  level?: number;
  description?: string;
  states: string[];
  
  // ARIA состояния
  expanded?: boolean;
  pressed?: boolean;
  checked?: boolean;
  required?: boolean;
  current?: boolean | string;
  
  // Навигация
  tabIndex?: number;
  shortcuts?: string[];
  isInteractive: boolean;
  
  // Позиционирование
  position?: ElementPosition;
  
  // Landmarks и регионы
  landmark?: string;
  region?: string;
  parentLandmarks?: string[];
  
  screenReaderText?: string;
}

export type NavigationMode = 'landmarks' | 'elements'; 