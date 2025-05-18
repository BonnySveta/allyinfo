import { FilterChips } from './FilterChips';
import { CATEGORIES, CategoryId } from '../../types/category';
import { Panel, VisuallyHidden, SelectedCount, ClearButton } from './styled';

interface FilterChipsPanelProps {
  selectedCategories: CategoryId[];
  onChange: (categories: CategoryId[]) => void;
  showCount?: boolean;
  categories?: any[];
}

export function FilterChipsPanel({
  selectedCategories,
  onChange,
  showCount = true,
  categories
}: FilterChipsPanelProps) {
  const handleClearAll = () => {
    onChange([]);
  };

  const cats = categories || CATEGORIES;

  return (
    <Panel>
      <VisuallyHidden>Категории</VisuallyHidden>
      <FilterChips
        categories={cats}
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