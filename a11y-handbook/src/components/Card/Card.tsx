import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Resource } from '../../types/resource';

interface CardProps {
  title: string;
  path: string;
  resources?: Resource[];
}

const CardContainer = styled.div`
  background: var(--nav-background);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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

const NewBadge = styled.span`
  background: var(--accent-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
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

const ResourceItem = styled.a`
  display: flex;
  align-items: flex-start;
  margin: 0;
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
  }

  > span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
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

const isNew = (date: string): boolean => {
  console.log('Date in isNew:', date);
  const resourceDate = new Date(date);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - resourceDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 3;
};

export function Card({ title, path, resources = [] }: CardProps) {
  const transformedResources = resources.map(resource => {
    console.log('Resource in transform:', resource);
    if ('preview_title' in resource) {
      return {
        ...resource,
        createdAt: (resource as any).created_at,
        preview: {
          title: (resource as any).preview_title,
          description: (resource as any).preview_description,
          image: (resource as any).preview_image,
          favicon: (resource as any).preview_favicon,
          domain: (resource as any).preview_domain
        }
      };
    }
    return resource;
  });

  const sortedResources = [...transformedResources].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  console.log('Sorted resources:', sortedResources.map(r => r.description));

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
              <ResourceItem 
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {resource.preview && (
                  <ResourceIcon 
                    src={
                      resource.section === '/telegram' && resource.preview.image 
                        ? resource.preview.image 
                        : resource.preview.favicon
                    }
                    alt=""
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <span>
                  {resource.preview?.title}
                  {isNew(resource.createdAt) && (
                    <NewBadge aria-label="Новый материал">New</NewBadge>
                  )}
                </span>
              </ResourceItem>
            ))}
          </ResourcesList>
        ) : (
          <EmptyState>Пока нет материалов</EmptyState>
        )}
      </CardContent>
    </CardContainer>
  );
} 