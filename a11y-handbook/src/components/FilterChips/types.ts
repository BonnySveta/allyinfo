import { Category, CategoryId } from '../../types/category';
import { ReactNode } from 'react';

export interface FilterChipProps {
  $isSelected: boolean;
  $color?: string;
  onClick: () => void;
  children: ReactNode;
  'aria-pressed': boolean;
}

export interface FilterChipsProps {
  categories: Category[];
  selectedCategories: CategoryId[];
  onChange: (categories: CategoryId[]) => void;
  label?: string;
}

export interface FilterChipsPanelProps {
  selectedCategories: CategoryId[];
  onChange: (categories: CategoryId[]) => void;
  showCount?: boolean;
} 