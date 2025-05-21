import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Resource } from '../../types/resource';
import { NewBadge } from '../NewBadge/NewBadge';
import {
  CardContainer,
  CardHeader,
  CardTitle,
  CardContent,
  ResourcesList,
  ResourceListItem,
  ResourceLink,
  ResourceContent,
  ResourceIcon,
  FallbackIcon,
  EmptyState,
  ViewAllLink
} from './styles';

interface CardProps {
  title: string;
  path: string;
  resources?: Resource[];
  viewAllText?: string;
}

export function Card({ title, path, resources = [], viewAllText }: CardProps) {
  const sortedResources = [...resources].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const hasMoreResources = resources.length > 3;
  const defaultViewAllText = `Все материалы (${resources.length})`;
  const customViewAllText = viewAllText ? `${viewAllText} (${resources.length})` : defaultViewAllText;

  return (
    <CardContainer>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {hasMoreResources && (
          <ViewAllLink to={path}>
            {customViewAllText}
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

  const getDomainInitial = () => {
    const domain = resource.domain || '';
    return domain.charAt(0).toUpperCase();
  };

  if (!favicon || !showFavicon) {
    return <FallbackIcon>{getDomainInitial()}</FallbackIcon>;
  }

  return (
    <ResourceIcon 
      src={favicon}
      alt=""
      onError={() => setShowFavicon(false)}
    />
  );
} 