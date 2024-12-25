import { FilterChips } from './FilterChips';
import { CATEGORIES, CategoryId } from '../../types/category';
import { Panel, VisuallyHidden, SelectedCount, ClearButton } from './styled';

interface FilterChipsPanelProps {
  selectedCategories: CategoryId[];
  onChange: (categories: CategoryId[]) => void;
  showCount?: boolean;
}

export function FilterChipsPanel({
  selectedCategories,
  onChange,
  showCount = true
}: FilterChipsPanelProps) {
  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <Panel>
      <VisuallyHidden>Категории</VisuallyHidden>
      <FilterChips
        categories={CATEGORIES}
        selectedCategories={selectedCategories}
        onChange={onChange}
      />
      {showCount && selectedCategories.length > 0 && (
        <SelectedCount>
          Выбрано категорий: {selectedCategories.length}
          {' '}
          <ClearButton onClick={handleClearAll}>
            Сбросить все
          </ClearButton>
        </SelectedCount>
      )}
    </Panel>
  );
} 