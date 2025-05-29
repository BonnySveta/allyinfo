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

interface BannerProps {
  title?: React.ReactNode;
  text?: React.ReactNode;
  link?: string;
  linkLabel?: React.ReactNode;
  emoji?: React.ReactNode;
}

export const Banner = ({ title, text, link, linkLabel, emoji }: BannerProps) => {
  return (
    <BannerContainer>
      {title && (
        <BannerTitle>
          <span>{title}</span>
          {emoji && <span role="img" aria-hidden="true">{emoji}</span>}
        </BannerTitle>
      )}
      {text && <div>{text}</div>}
      {link && linkLabel && (
        <BannerLink href={link} aria-label={typeof linkLabel === 'string' ? linkLabel : undefined}>
          {linkLabel}
        </BannerLink>
      )}
    </BannerContainer>
  );
}; 