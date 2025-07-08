import styled from 'styled-components';
import { ResourceWithSectionSlug } from '../../types/resource';
import React, { useState } from 'react';
import { NewBadge } from '../NewBadge/NewBadge';

interface ResourceItemProps {
  resource: ResourceWithSectionSlug;
}

const ResourceCard = styled.a`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--card-background);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-color);
  transition: all 0.2s ease;

  &:hover {
    background: var(--interactive-element-hover);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
    gap: 0.75rem;
  }
`;

const ResourceIcon = styled.img`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
`;

const FallbackIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: var(--background-color);
  color: var(--text-secondary);
  font-size: 12px;
  margin-right: 8px;
  vertical-align: middle;
`;

const DomainInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.85rem;
  justify-content: flex-end;
  
  @media (min-width: 769px) {
    margin-top: 0.75rem;
  }

  @media (max-width: 768px) {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--border-color);
  }
`;

const ResourceContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ResourceTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ResourceDescription = styled.p`
  margin: 0.5rem 0 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
  flex: 1;
`;

export function ResourceItem({ resource }: ResourceItemProps) {
  const [showFavicon, setShowFavicon] = useState(true);
  const favicon = resource.favicon;

  // Отладочная информация
  console.log('ResourceItem debug:', {
    title: resource.title,
    createdAt: resource.createdAt,
    hasCreatedAt: !!resource.createdAt
  });

  // Получаем первую букву домена для fallback
  const getDomainInitial = () => {
    const domain = resource.domain || '';
    return domain.charAt(0).toUpperCase();
  };

  return (
    <ResourceCard 
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <ResourceContent>
        <ResourceTitle>
          {resource.title}
          <NewBadge createdAt={resource.createdAt} approvedAt={resource.approvedAt} />
        </ResourceTitle>
        {resource.description && (
          <ResourceDescription>
            {resource.description}
          </ResourceDescription>
        )}
        {resource.descriptionFull && (
          <ResourceDescription>
            {resource.descriptionFull}
          </ResourceDescription>
        )}
        <DomainInfo>
          {favicon && showFavicon ? (
            <ResourceIcon 
              src={favicon}
              alt=""
              onError={() => setShowFavicon(false)}
            />
          ) : (
            <FallbackIcon>
              {getDomainInitial()}
            </FallbackIcon>
          )}
          <span>{resource.domain}</span>
        </DomainInfo>
      </ResourceContent>
    </ResourceCard>
  );
} 