import styled from 'styled-components';

interface NewBadgeProps {
  createdAt: string;
  className?: string;
}

const Badge = styled.span`
  background: var(--accent-color);
  color: white;
  padding: 0 0.3rem 0.1rem;
  border-radius: 7px;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  margin-left: 0.5rem;
  vertical-align: middle;
`;

const isNew = (date: string): boolean => {
  const resourceDate = new Date(date);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - resourceDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 3;
};

export function NewBadge({ createdAt, className }: NewBadgeProps) {
  if (!isNew(createdAt)) return null;

  return (
    <Badge className={className} aria-label="Новый материал">
      New
    </Badge>
  );
} 