import styled from 'styled-components';
import { Link } from 'react-router-dom';

interface Resource {
  id: number;
  url: string;
  section: string;
  description: string | null;
  preview: {
    title: string;
    description: string;
    image: string | null;
    favicon: string;
    domain: string;
  };
  createdAt: string;
}

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
  color: var(--accent-color);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:hover {
    text-decoration: underline;
  }
`;

const Favicon = styled.img`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  border-radius: 2px;
`;

const ResourceTitle = styled.span`
  flex-grow: 1;
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

export function Card({ title, path, resources = [] }: CardProps) {
  const sortedResources = [...resources].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const isToday = (date: string) => {
    const today = new Date();
    const itemDate = new Date(date);
    return (
      itemDate.getDate() === today.getDate() &&
      itemDate.getMonth() === today.getMonth() &&
      itemDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <CardContainer>
      <CardHeader>
        <CardTitle>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedResources.length > 0 ? (
          <ResourcesList>
            {sortedResources.slice(0, 5).map(resource => (
              <ResourceItem key={resource.id}>
                <ResourceLink 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {((resource.url.includes('t.me/') && resource.preview.image) || resource.preview.favicon) && (
                    <Favicon 
                      src={
                        // Если это Telegram канал и есть preview.image, используем его
                        resource.url.includes('t.me/') && resource.preview.image 
                          ? resource.preview.image 
                          : resource.preview.favicon
                      } 
                      alt=""
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        if (!resource.url.includes('t.me/') && img.src === resource.preview.favicon && resource.preview.image) {
                          // Для не-Telegram ресурсов, если фавикон не загрузился, пробуем использовать image
                          img.src = resource.preview.image;
                        } else {
                          // Если изображение не загрузилось, скрываем элемент
                          img.style.display = 'none';
                        }
                      }}
                    />
                  )}
                  <ResourceTitle>{resource.preview.title}</ResourceTitle>
                  {isToday(resource.createdAt) && <NewResourceBadge>New</NewResourceBadge>}
                </ResourceLink>
              </ResourceItem>
            ))}
          </ResourcesList>
        ) : (
          <EmptyState>Пока нет материалов</EmptyState>
        )}
      </CardContent>
      {sortedResources.length > 0 && (
        <CardFooter>
          <ResourceCount>{resources.length} материалов</ResourceCount>
          {resources.length > 5 && (
            <Link to={path}>Смотреть все</Link>
          )}
        </CardFooter>
      )}
    </CardContainer>
  );
} 