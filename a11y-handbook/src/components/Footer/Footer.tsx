import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: var(--nav-background);
  padding: 1.5rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const SupportLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;

  &:hover {
    color: var(--link-hover-color);
  }

  svg {
    color: var(--accent-color);
  }
`;

export function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>
          © 2024 A11Y Wiki. Все материалы распространяются по лицензии MIT.
        </Copyright>
        <SupportLink to="/support">
          Поддержать проект <FaHeart />
        </SupportLink>
      </FooterContent>
    </FooterContainer>
  );
} 