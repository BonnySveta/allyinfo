import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { scrollToTop } from '../../utils/scrollOnTop';

const AdminContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  color: var(--text-color);
`;

const AdminGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const AdminCard = styled(Link)`
  background: var(--nav-background);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  text-decoration: none;
  color: var(--text-color);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const CardDescription = styled.p`
  color: var(--text-secondary-color);
  font-size: 0.9rem;
  margin: 0;
`;

export function Admin() {
  return (
    <AdminContainer>
      <Title>Админ-панель</Title>
      <AdminGrid>
        <AdminCard to="/admin/materials" onClick={scrollToTop}>
          <CardTitle>Материалы</CardTitle>
          <CardDescription>
            Управление всеми материалами: модерация, публикация, фильтры по статусу и категориям
          </CardDescription>
        </AdminCard>
        <AdminCard to="/admin/feedback-list" onClick={scrollToTop}>
          <CardTitle>Обратная связь</CardTitle>
          <CardDescription>
            Просмотр полученной обратной связи от пользователей
          </CardDescription>
        </AdminCard>
      </AdminGrid>
    </AdminContainer>
  );
} 