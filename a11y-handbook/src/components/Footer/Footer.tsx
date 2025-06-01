import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaHeart, FaTelegram } from 'react-icons/fa';
import { useContext } from 'react';
import { FocusContext } from '../../context/FocusContext';
import { scrollToTop } from '../../utils/scrollOnTop';

const FooterWrapper = styled.footer`
  flex-shrink: 0;
  margin-top: auto;
  font-size: 0.9rem;
  background: var(--nav-background);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2rem;
  padding: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1.5rem;
    padding: 1rem;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  gap: 1rem;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

const SectionTitle = styled.h3`
  color: var(--text-color);
  font-size: 1.1rem;
  margin: 0;
  font-weight: 500;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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

const ExternalLink = styled.a`
  color: var(--text-secondary);
  text-decoration: underline;
  text-decoration-style: solid;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
  font-size: 0.9rem;
  transition: color 0.2s ease;
  text-decoration-color: rgba(102, 102, 102, 0.5);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: var(--link-hover-color);
    text-decoration-color: var(--link-hover-color);
  }
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Copyright = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 2rem;
  text-align: center;
  grid-column: 1 / -1;
  border-top: 1px solid var(--nav-hover-background);
  padding-top: 1.5rem;
`;

const SupportLink = styled(BaseFooterLink)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);

  svg {
    color: #a259ff;
  }
`;

const LogoPlaceholder = styled.div`
  width: 180px;
  height: 38px;
  background: #a062f0;
  color: #ffdb12;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  border-radius: 8px;
  user-select: none;
`;

export function Footer() {
  const year = new Date().getFullYear();
  const { focusRef } = useContext(FocusContext);

  return (
    <FooterWrapper>
      <FooterContent>
        <FooterSection>
          <LogoPlaceholder>ALLYINFO.RU</LogoPlaceholder>
          © {year} ALLYINFO.RU<br/>Материалы распространяются по лицензии MIT.
        </FooterSection>

        <FooterSection>
          <SectionTitle>О проекте</SectionTitle>
          <FooterLinks>
            <BaseFooterLink to="/feedback" onClick={scrollToTop}>
              Обратная связь
            </BaseFooterLink>
            <SupportLink to="/support" onClick={() => {
              scrollToTop();
              focusRef && focusRef.focus();
            }}>
              Поддержать проект <FaHeart />
            </SupportLink>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <SectionTitle>Сотрудничество</SectionTitle>
          <FooterLinks>
            <ExternalLink href="https://t.me/bonnysveta" target="_blank" rel="noopener noreferrer">
              <FaTelegram /> Написать в Telegram
            </ExternalLink>
            <ExternalLink href="https://t.me/allyinforu" target="_blank" rel="noopener noreferrer">
              <FaTelegram /> Наш канал
            </ExternalLink>
          </FooterLinks>
        </FooterSection>

        
      </FooterContent>
    </FooterWrapper>
  );
} 
