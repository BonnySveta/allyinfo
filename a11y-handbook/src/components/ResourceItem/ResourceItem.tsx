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
  return (
    <ResourceCard 
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <ResourceContent>
        <ResourceTitle>{resource.preview?.title}</ResourceTitle>
        {resource.preview?.description && (
          <ResourceDescription>
            {resource.preview.description}
          </ResourceDescription>
        )}
        <DomainInfo>
          {resource.preview?.favicon && (
            <ResourceIcon 
              src={resource.preview.favicon}
              alt=""
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          {resource.preview?.domain}
        </DomainInfo>
      </ResourceContent>
    </ResourceCard>
  );
} 