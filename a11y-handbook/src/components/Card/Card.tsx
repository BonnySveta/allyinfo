import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Resource } from '../../types/resource';
import { NewBadge } from '../NewBadge/NewBadge';
import { useState, useEffect } from 'react';

interface CardProps {
  title: string;
  path: string;
  resources?: Resource[];
}

const CardContainer = styled.div`
  background: var(--card-background);
  border-radius: 12px;
  padding: 1.5rem;
  animation: fadeInUp 0.5s ease forwards;

  @media (max-width: 768px) {
    width: 100%;
    padding: 1rem;
    border-radius: 8px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--nav-hover-background);

  @media (max-width: 768px) {
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
  }
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-color);
  font-weight: 600;
  cursor: default;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const CardContent = styled.div`
  margin: 1rem 0;
`;

const ResourcesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ResourceListItem = styled.li`
  margin: 0;
  padding: 0;
`;

const ResourceLink = styled.a`
  display: flex;
  align-items: flex-start;
  padding: 0.75rem;
  background: var(--resource-link-background);
  border-radius: 8px;
  transition: all 0.2s ease;
  text-decoration: none;
  color: var(--text-color);
  font-size: 0.95rem;
  line-height: 1.4;
  font-weight: 400;
  
  &:hover {
    background: var(--interactive-element-hover);
    color: var(--link-hover-color);
    transform: translateY(-2px);
  }
`;

const ResourceContent = styled.span`
  flex: 1;
`;

const ResourceIcon = styled.img`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 12px;
  background: var(--background-color);
`;

const FallbackIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: var(--background-color);
  color: var(--text-secondary);
  font-size: 14px;
  margin-right: 12px;
  flex-shrink: 0;
`;

const EmptyState = styled.div`
  color: var(--text-secondary);
  text-align: center;
  padding: 2rem;
  background: var(--background-secondary);
  border-radius: 8px;
  font-size: 0.9rem;
`;

const ViewAllLink = styled(Link)`
  color: var(--link-color);
  font-size: 0.9rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: var(--link-hover-color);
  }

  &::after {
    content: '→';
    transition: transform 0.2s ease;
  }

  &:hover::after {
    transform: translateX(4px);
  }
`;

export function Card({ title, path, resources = [] }: CardProps) {
  const sortedResources = [...resources].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const hasMoreResources = resources.length > 3;

  return (
    <CardContainer>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {hasMoreResources && (
          <ViewAllLink to={path}>
            Все материалы ({resources.length})
          </ViewAllLink>
        )}
      </CardHeader>
      <CardContent>
        {resources.length > 0 ? (
          <ResourcesList>
            {sortedResources.slice(0, 3).map(resource => (
              <ResourceListItem key={resource.id}>
                <ResourceLink 
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ResourceIconWithFallback resource={resource} />
                  <ResourceContent>
                    {resource.title}
                  </ResourceContent>
                </ResourceLink>
              </ResourceListItem>
            ))}
          </ResourcesList>
        ) : (
          <EmptyState>Пока нет материалов</EmptyState>
        )}
      </CardContent>
    </CardContainer>
  );
}

function ResourceIconWithFallback({ resource }: { resource: Resource }) {
  const [showFavicon, setShowFavicon] = useState(true);
  const favicon = resource.favicon;

  // Дебаг-вывод
  console.log('ResourceIconWithFallback:', {
    favicon,
    showFavicon,
    domain: resource.domain,
    title: resource.title,
    resource,
  });

  const getDomainInitial = () => {
    const domain = resource.domain || '';
    return domain.charAt(0).toUpperCase();
  };

  if (!favicon || !showFavicon) {
    console.log('Render fallback:', getDomainInitial());
    return <FallbackIcon>{getDomainInitial()}</FallbackIcon>;
  }

  console.log('Render favicon:', favicon);
  return (
    <ResourceIcon 
      src={favicon}
      alt=""
      onError={() => setShowFavicon(false)}
    />
  );
}

// Скелетон для карточки
export const SkeletonCard = () => (
  <CardContainer style={{ opacity: 0.7 }}>
    <CardHeader>
      <div style={{ width: '40%', height: 24, background: '#e9eef6', borderRadius: 6, marginBottom: 8 }} />
    </CardHeader>
    <CardContent>
      <ResourcesList>
        {[1, 2, 3].map(i => (
          <ResourceListItem key={i}>
            <ResourceLink style={{ pointerEvents: 'none' }}>
              <div style={{ width: 20, height: 20, background: '#e9eef6', borderRadius: 4, marginRight: 12 }} />
              <div style={{ flex: 1 }}>
                <div style={{ width: '70%', height: 14, background: '#e9eef6', borderRadius: 4, marginBottom: 6 }} />
                <div style={{ width: '40%', height: 10, background: '#e9eef6', borderRadius: 4 }} />
              </div>
            </ResourceLink>
          </ResourceListItem>
        ))}
      </ResourcesList>
    </CardContent>
  </CardContainer>
); 