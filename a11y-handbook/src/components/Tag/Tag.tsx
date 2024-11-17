import styled from 'styled-components';
import { Tag as TagType } from '../../types/tags';

const TagWrapper = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${({ $color }) => `${$color}20`}; // 20 - это прозрачность
  color: ${({ $color }) => $color};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ $color }) => `${$color}30`};
  }
`;

interface TagProps {
  tag: TagType;
}

export const Tag: React.FC<TagProps> = ({ tag }) => {
  return (
    <TagWrapper $color={tag.color}>
      {tag.label}
    </TagWrapper>
  );
}; 