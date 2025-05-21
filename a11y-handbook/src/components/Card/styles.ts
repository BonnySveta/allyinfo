import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const CardContainer = styled.div`
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

export const CardHeader = styled.div`
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

export const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-color);
  font-weight: 600;
  cursor: default;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const CardContent = styled.div`
  margin: 1rem 0;
`;

export const ResourcesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ResourceListItem = styled.li`
  margin: 0;
  padding: 0;
`;

export const ResourceLink = styled.a`
  display: flex;
  align-items: center;
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

export const ResourceContent = styled.span`
  flex: 1;
`;

export const ResourceIcon = styled.img`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 12px;
  background: var(--background-color);
`;

export const FallbackIcon = styled.span`
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

export const EmptyState = styled.div`
  color: var(--text-secondary);
  text-align: center;
  padding: 2rem;
  background: var(--background-secondary);
  border-radius: 8px;
  font-size: 0.9rem;
`;

export const ViewAllLink = styled(Link)`
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