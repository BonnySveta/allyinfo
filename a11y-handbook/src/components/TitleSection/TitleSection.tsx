import { FC, ReactNode } from 'react';
import styled from 'styled-components';

const TitleSectionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    margin: 1.5rem 0 2rem;
    padding: 0;
    align-items: flex-start;
  }
`;

const TitleContainer = styled.div`
  flex-grow: 1;
  min-width: 0;
  max-width: 600px;
  margin: 2rem 0 3rem;
  padding: 0 2rem 0 0;

  @media (max-width: 768px) {
    margin: 1.5rem 0 2rem;
    padding: 0;
    max-width: 100%;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  text-align: left;
  margin-bottom: 0.5rem;
  color: var(--text-color);

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  text-align: left;
  margin: 0;
  color: var(--text-secondary-color);
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

interface TitleSectionProps {
  title: string;
  subtitle: string;
  banner?: React.ReactNode;
}

export const TitleSection: FC<TitleSectionProps> = ({ title, subtitle, banner }) => {
  return (
    <TitleSectionContainer>
      <TitleContainer>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
      </TitleContainer>
      {banner}
    </TitleSectionContainer>
  );
};