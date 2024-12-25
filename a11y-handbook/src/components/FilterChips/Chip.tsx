import styled from 'styled-components';

export interface ChipProps {
  $isSelected: boolean;
  $color?: string;
  onClick: () => void;
  children: React.ReactNode;
  'aria-pressed': boolean;
}

const ChipButton = styled.button<{ $isSelected: boolean; $color?: string }>`
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

export function Chip({ children, ...props }: ChipProps) {
  return (
    <ChipButton {...props}>
      {children}
    </ChipButton>
  );
} 