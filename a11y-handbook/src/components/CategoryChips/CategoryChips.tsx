import styled from 'styled-components';
import { Category, CategoryId } from '../../types/category';

const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 2rem;

  @media (max-width: 768px) {
    margin: 0.5rem 0;
    gap: 0.35rem;
  }
`;

const Chip = styled.button<{ $isSelected: boolean; $color?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  border: 1px solid ${props => props.$color || 'var(--border-color)'};
  background: ${props => props.$isSelected ? (props.$color || 'var(--accent-color)') : 'transparent'};
  color: ${props => props.$isSelected ? '#fff' : 'var(--text-color)'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    padding: 0.35rem 0.75rem;
    font-size: 0.85rem;
  }

  &:hover {
    background: ${props => props.$color || 'var(--accent-color)'};
    color: #fff;
  }

  &:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
`;

interface CategoryChipsProps {
  categories: Category[];
  selectedCategories: CategoryId[];
  onChange: (categories: CategoryId[]) => void;
  label?: string;
}

export function CategoryChips({ 
  categories, 
  selectedCategories, 
  onChange,
  label = 'Фильтр по категориям'
}: CategoryChipsProps) {
  const handleChipClick = (categoryId: CategoryId) => {
    if (selectedCategories.includes(categoryId)) {
      onChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onChange([...selectedCategories, categoryId]);
    }
  };

  return (
    <ChipsContainer role="group" aria-label={label}>
      {categories.map(category => (
        <Chip
          key={category.id}
            onClick={() => handleChipClick(category.id)}
            $isSelected={selectedCategories.includes(category.id)}
            $color={category.color}
            aria-pressed={selectedCategories.includes(category.id)}
        >
          {category.label}
        </Chip>
      ))}
    </ChipsContainer>
  );
} 