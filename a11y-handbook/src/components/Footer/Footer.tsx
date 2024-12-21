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

const FooterLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const BaseFooterLink = styled(Link)`
  color: var(--text-secondary);
  text-decoration: underline;
  text-decoration-style: solid;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
  font-size: 0.9rem;
  transition: color 0.2s ease;
  text-decoration-color: rgba(102, 102, 102, 0.5);

  &:hover {
    color: var(--link-hover-color);
    text-decoration-color: var(--link-hover-color);
  }
`;

const FooterLink = styled(BaseFooterLink)`
  // Специфичные стили для FooterLink, если нужны
`;

const SupportLink = styled(BaseFooterLink)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);

  svg {
    color: var(--accent-color);
  }
`;

export function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>
          ©  2024 A11Y Wiki. Все материалы распространяются по лицензии MIT.
        </Copyright>
        <FooterLinks>
          <FooterLink to="/feedback">
            Обратная связь
          </FooterLink>
          <SupportLink to="/support">
            Поддержать проект <FaHeart />
          </SupportLink>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  );
} 