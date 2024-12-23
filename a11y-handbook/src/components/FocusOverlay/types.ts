// Типы и интерфейсы
export interface SpotlightPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface FlowConnection {
  from: DOMRect;
  to: DOMRect;
  label: string;
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
  visited?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  
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
  nextFocusableElement?: HTMLElement; // Изме��яем тип с Element на HTMLElement
  isModal?: boolean;
  isLiveRegion?: boolean;
  isFocusable?: boolean;
}

export type NavigationMode = 'landmarks' | 'elements'; 

// Типы для виртуального буфера
export interface VirtualNode {
  element: Element;
  role: string;
  children: VirtualNode[];
  parent?: VirtualNode;
  next?: VirtualNode;
  previous?: VirtualNode;
  firstChild?: VirtualNode;
  lastChild?: VirtualNode;
  isInteractive: boolean;
  isFocusable: boolean;
  isHidden: boolean;
  label: string;
  states: string[];
  screenReaderText?: string;
  description?: string;
  isLiveRegion?: boolean;
  liveSettings?: {
    mode: 'polite' | 'assertive' | 'off';
    atomic: boolean;
    relevant: string[];
  };
  isModal?: boolean;
  flowTargets?: Array<{
    element: Element;
    label: string;
    node: VirtualNode | null;
  }>;
}

export interface VirtualBuffer {
  root: VirtualNode;
  currentNode: VirtualNode | null;
  mode: 'browse' | 'focus';
}