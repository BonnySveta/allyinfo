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
  virtualOnly?: boolean; // Элемент только для виртуального фокуса
  nextFocusableElement?: HTMLElement; // Изменяем тип с Element на HTMLElement
}

export type NavigationMode = 'landmarks' | 'elements'; 

// Типы для виртуального буфера
export interface VirtualNode {
  element: Element;
  role: string;
  level?: number;
  children: VirtualNode[];
  parent?: VirtualNode;
  isInteractive: boolean;
  isFocusable: boolean;
  isHidden: boolean;
  
  // Навигационные свойства
  next?: VirtualNode;
  previous?: VirtualNode;
  firstChild?: VirtualNode;
  lastChild?: VirtualNode;
  
  // Информация для скринридера
  label: string;
  description?: string;
  states: string[];
}

export interface VirtualBuffer {
  root: VirtualNode;
  currentNode: VirtualNode | null;
  mode: 'browse' | 'focus';
}