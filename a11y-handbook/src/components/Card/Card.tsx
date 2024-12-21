import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Resource } from '../../types/resource';
import { NewBadge } from '../NewBadge/NewBadge';

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
  background: var(--nav-background);
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
                  {resource.preview && (
                    <ResourceIcon 
                      src={resource.preview.favicon}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <ResourceContent>
                    {resource.preview?.title}
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