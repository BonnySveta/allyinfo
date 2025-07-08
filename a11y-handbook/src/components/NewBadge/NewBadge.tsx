import styled from 'styled-components';

interface NewBadgeProps {
  createdAt: string;
  approvedAt?: string;
  className?: string;
}

const Badge = styled.span`
  background: #ff4444;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  margin-left: 0.5rem;
  vertical-align: middle;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const isNew = (date: string): boolean => {
  const resourceDate = new Date(date);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - resourceDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 14; // 2 недели = 14 дней
};

export function NewBadge({ createdAt, approvedAt, className }: NewBadgeProps & { approvedAt?: string }) {
  const dateToCheck = approvedAt || createdAt;
  const shouldShow = isNew(dateToCheck);
  if (!shouldShow) return null;

  return (
    <Badge className={className} aria-label="Новый материал">
      Новое
    </Badge>
  );
} 