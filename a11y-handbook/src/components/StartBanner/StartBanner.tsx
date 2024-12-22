import styled from 'styled-components';

const BannerContainer = styled.div`
  background: var(--banner-background);
  color: var(--text-color);
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 400px;
  
  @media (max-width: 768px) {
    margin-top: 1rem;
    max-width: 100%;
  }
`;

const BannerTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: inherit;
  margin-bottom: 1rem;
`;

const BannerLink = styled.a`
  color: inherit;
  text-decoration: none;
  display: inline;
  
  &:hover {
    opacity: 0.9;
  }

  &::after {
    content: '→';
    transition: transform 0.2s ease;
    color: inherit;
    display: inline-block;
    margin-left: 0.25rem;
  }

  &:hover::after {
    transform: translateX(4px);
  }
`;

export const StartBanner = () => {
  return (
    <BannerContainer>
      <BannerTitle>
        <span>С чего начать?</span>
        <span role="img" aria-hidden="true">💡</span>
      </BannerTitle>
      <BannerLink 
        href="/getting-started"
        target="_blank"
        rel="noopener noreferrer"
      >
        WCAG и другие материалы для тех, кто начинает изучать цифровую доступность
      </BannerLink>
    </BannerContainer>
  );
}; 