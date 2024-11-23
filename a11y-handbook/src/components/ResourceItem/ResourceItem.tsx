import styled from 'styled-components';
import { Resource } from '../../types/resource';

interface ResourceItemProps {
  resource: Resource;
}

const ResourceCard = styled.a`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--nav-background);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-color);
  transition: all 0.2s ease;

  &:hover {
    background: var(--interactive-element-hover);
    transform: translateY(-2px);
  }
`;

const ResourceIcon = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
`;

const ResourceContent = styled.div`
  flex: 1;
`;

const ResourceTitle = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
`;

const ResourceDescription = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
`;

export function ResourceItem({ resource }: ResourceItemProps) {
  return (
    <ResourceCard 
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {resource.preview?.favicon && (
        <ResourceIcon 
          src={resource.preview.favicon}
          alt=""
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      <ResourceContent>
        <ResourceTitle>{resource.preview?.title}</ResourceTitle>
        {resource.preview?.description && (
          <ResourceDescription>
            {resource.preview.description}
          </ResourceDescription>
        )}
      </ResourceContent>
    </ResourceCard>
  );
} 