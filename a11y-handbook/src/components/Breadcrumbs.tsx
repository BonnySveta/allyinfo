import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const BreadcrumbsWrapper = styled.nav`
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  color: var(--text-secondary-color);
`;

const Crumb = styled.span`
  & a {
    color: var(--text-secondary-color);
    text-decoration: underline;
    text-underline-offset: 3px;
    &:hover {
      color: var(--text-secondary-color);
    }
  }
`;

const Separator = styled.span`
  margin: 0 0.5rem;
  color: var(--text-secondary-color);
`;

export function Breadcrumbs({ items }: { items: { label: string, to?: string }[] }) {
  return (
    <BreadcrumbsWrapper aria-label="Хлебные крошки">
      {items.map((item, idx) => (
        <Crumb key={idx}>
          {item.to ? <Link to={item.to}>{item.label}</Link> : item.label}
          {idx < items.length - 1 && <Separator>/</Separator>}
        </Crumb>
      ))}
    </BreadcrumbsWrapper>
  );
} 