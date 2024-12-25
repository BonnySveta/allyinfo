import styled from 'styled-components';
import { Category, CategoryId } from '../../types/category';
import { Chip } from './Chip';

const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;

  @media (max-width: 768px) {
    margin: 0.5rem 0;
    gap: 0.35rem;
  }
`;

interface FilterChipsProps {
  categories: Category[];
  selectedCategories: CategoryId[];
  onChange: (categories: CategoryId[]) => void;
  label?: string;
}

export function FilterChips({ 
  categories, 
  selectedCategories, 
  onChange,
  label = 'Фильтр по категориям'
}: FilterChipsProps) {
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