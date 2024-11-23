import styled from 'styled-components';
import { ResourceSection, pageConfig } from '../../pages/ResourcePage/config';
import { useResources } from '../../hooks/useResources';
import { ResourceItem } from '../ResourceItem/ResourceItem';

interface ResourcePageProps {
  section: ResourceSection;
}

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--text-color);
`;

const Description = styled.p`
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const ResourcesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--error-color);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
  background: var(--background-secondary);
  border-radius: 12px;
`;

export function ResourcePage({ section }: ResourcePageProps) {
  const { resources, loading, error } = useResources(section);
  const { title, description } = pageConfig[section];

  if (loading) {
    return <LoadingText>Загрузка материалов...</LoadingText>;
  }

  if (error) {
    return <ErrorText>{error}</ErrorText>;
  }

  return (
    <PageContainer>
      <Title>{title}</Title>
      <Description>{description}</Description>
      {resources.length > 0 ? (
        <ResourcesList>
          {resources.map(resource => (
            <ResourceItem 
              key={resource.id}
              resource={resource}
            />
          ))}
        </ResourcesList>
      ) : (
        <EmptyState>Пока нет материалов</EmptyState>
      )}
    </PageContainer>
  );
} 