import styled from 'styled-components';

const BannerContainer = styled.div`
  background: #95fbde;
  color: #000;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 2rem 0;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid #7ae5c7;

  @media (max-width: 768px) {
    margin: 1rem 0;
    padding: 1rem;
  }
`;

const BannerTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #000;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const BannerText = styled.p`
  font-size: 1.1rem;
  margin: 0 0 1.5rem 0;
  color: #333;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const BannerButton = styled.a`
  display: inline-block;
  background: #000;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  border: 2px solid #000;

  &:hover {
    background: #333;
    border-color: #333;
    transform: translateY(-2px);
    box-shadow: 0 px 8px rgba(0, 0, 0, 0.2);
  }

  &:focus {
    outline: 3px solid #fff;
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

export const AccessibilityUnityBanner = () => {
  return (
    <BannerContainer>
      <BannerTitle>Школа цифровой доступности Accessibility Unity</BannerTitle>
      <BannerText>
        Ведет набор на 12 поток курса по цифровой доступности
      </BannerText>
      <BannerButton 
        href="https://accessibilityunity.com/" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Перейти на сайт школы цифровой доступности Accessibility Unity"
      >
        Подробнее
      </BannerButton>
    </BannerContainer>
  );
};
