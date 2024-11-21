import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Resource } from '../../types/resource';
import { LinkPreview } from '../LinkPreview/LinkPreview';

interface CardProps {
  title: string;
  path: string;
  resources?: Resource[];
}

const CardContainer = styled.div`
  background: var(--card-background);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NewBadge = styled.span`
  background: var(--accent-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const CardContent = styled.div`
  margin: 1rem 0;
`;

const CardFooter = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const ResourceCount = styled.span`
  color: var(--text-secondary);
`;

const ResourcesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
`;

const ResourceItem = styled.li`
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ResourceLink = styled.a`
  display: flex;
  align-items: center;
  color: var(--text-color);
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ResourceIcon = styled.img`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  border-radius: 2px;
  object-fit: cover;
  margin-right: 8px;
`;

const EmptyState = styled.div`
  color: var(--text-secondary);
  text-align: center;
  padding: 1rem;
`;

const NewResourceBadge = styled.span`
  background: var(--accent-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-left: 0.5rem;
`;

const TELEGRAM_FALLBACK_ICON = 'https://telegram.org/img/t_logo.png';

const PreviewImage = styled.img`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 4px;
  object-fit: cover;
`;

export function Card({ title, path, resources = [] }: CardProps) {
  const transformedResources = resources.map(resource => {
    if ('preview_title' in resource) {
      return {
        ...resource,
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

  return (
    <CardContainer>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {resources.length > 0 ? (
          <ResourcesList>
            {sortedResources.slice(0, 5).map(resource => (
              <ResourceItem key={resource.id}>
                <ResourceLink 
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
                  {resource.preview?.title}
                </ResourceLink>
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