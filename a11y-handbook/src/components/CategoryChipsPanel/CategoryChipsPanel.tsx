import styled from 'styled-components';
import { CategoryChips } from '../CategoryChips/CategoryChips';
import { CATEGORIES, CategoryId } from '../../types/category';

const Panel = styled.section`
  padding: 0 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const VisuallyHidden = styled.h2`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const SelectedCount = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary-color);
  margin-top: 0.5rem;
`;

interface CategoryChipsPanelProps {
  selectedCategories: CategoryId[];
  onChange: (categories: CategoryId[]) => void;
  showCount?: boolean;
}

export function CategoryChipsPanel({
  selectedCategories,
  onChange,
  showCount = true
}: CategoryChipsPanelProps) {
  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <Panel>
      <VisuallyHidden>Категории</VisuallyHidden>
      <CategoryChips
        categories={CATEGORIES}
        selectedCategories={selectedCategories}
        onChange={onChange}
      />
      {showCount && selectedCategories.length > 0 && (
        <SelectedCount>
          Выбрано категорий: {selectedCategories.length}
          {' '}
          <button 
            onClick={handleClearAll}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--accent-color)', 
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline'
            }}
          >
            Сбросить все
          </button>
        </SelectedCount>
      )}
    </Panel>
  );
} 