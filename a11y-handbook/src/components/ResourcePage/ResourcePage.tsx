import styled from 'styled-components';
import { ResourceSection, pageConfig } from '../../pages/ResourcePage/config';
import { useResources } from '../../hooks/useResources';
import { ResourceItem } from '../ResourceItem/ResourceItem';
import { Resource } from '../../types/resource';
import { Breadcrumbs } from '../Breadcrumbs';

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
  gap: 1.5rem;
  animation: fadeIn 0.3s ease-in-out;

  @media (max-width: 768px) {
    gap: 1rem;
  }

  & > * {
    width: 100%;
    max-width: 100%;
  }
`;

const LoadingText = styled.div`
  color: var(--text-secondary);
  text-align: center;
  font-size: 1.2rem;
  margin: 2rem 0;
`;

export const ResourcePage: React.FC<ResourcePageProps> = ({ section }) => {
  const { resources, loading, error } = useResources(pageConfig[section].section_id);
  const crumbs = [
    { label: 'Главная', to: '/' },
    { label: pageConfig[section].title }
  ];

  if (loading) {
    return (
      <PageContainer>
        <Breadcrumbs items={crumbs} />
        <Title>{pageConfig[section].title}</Title>
        <Description>{pageConfig[section].description}</Description>
        <LoadingText>Загрузка материалов...</LoadingText>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Breadcrumbs items={crumbs} />
        <Title>{pageConfig[section].title}</Title>
        <Description>{pageConfig[section].description}</Description>
        <LoadingText>Произошла ошибка при загрузке материалов</LoadingText>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Breadcrumbs items={crumbs} />
      <Title>{pageConfig[section].title}</Title>
      <Description>{pageConfig[section].description}</Description>
      <ResourcesList>
        {resources.map((resource: Resource) => (
          <ResourceItem key={resource.id} resource={resource} />
        ))}
      </ResourcesList>
    </PageContainer>
  );
};