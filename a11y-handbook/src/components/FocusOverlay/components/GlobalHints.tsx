// Компонент глобальных подсказок
import { NavigationMode } from '../types';
import { 
  GlobalHintsContainer, 
  ButtonWrapper,
  CollapseButton,
  CollapsedIndicator,
  HintsSection, 
  HintsTitle, 
  Shortcut 
} from '../styles';

interface GlobalHintsProps {
  navigationMode: NavigationMode;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function GlobalHints({ navigationMode, isCollapsed, onToggleCollapse }: GlobalHintsProps) {
  return (
    <GlobalHintsContainer $isCollapsed={isCollapsed}>
      <ButtonWrapper onClick={onToggleCollapse}>
        <CollapseButton $isCollapsed={isCollapsed}>
          {isCollapsed ? '←' : '→'}
        </CollapseButton>
      </ButtonWrapper>

      {isCollapsed ? (
        <CollapsedIndicator>Подсказки</CollapsedIndicator>
      ) : (
        <>
          <HintsSection>
            <HintsTitle>Режим навигации ({navigationMode === 'landmarks' ? 'ориентиры' : 'элементы'})</HintsTitle>
            <Shortcut>F6: переключить режим</Shortcut>
          </HintsSection>

          <HintsSection>
            <HintsTitle>Навигация по ориентирам</HintsTitle>
            {navigationMode === 'landmarks' ? (
              <>
                <Shortcut>Tab: следующий ориентир</Shortcut>
                <Shortcut>Shift + Tab: предыдущий ориентир</Shortcut>
              </>
            ) : (
              <Shortcut>F6: включить режим ориентиров</Shortcut>
            )}
          </HintsSection>

          <HintsSection>
            <HintsTitle>Навигация по заголовкам</HintsTitle>
            <Shortcut>H: следующий заголовок</Shortcut>
            <Shortcut>Shift + H: предыдущий заголовок</Shortcut>
            <Shortcut>1-6: заголовок определенного уровня</Shortcut>
          </HintsSection>
        </>
      )}
    </GlobalHintsContainer>
  );
} 