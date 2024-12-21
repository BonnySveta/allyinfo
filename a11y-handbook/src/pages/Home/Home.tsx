import { FC } from 'react';
import styled from 'styled-components';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { StartBanner } from '../../components/StartBanner/StartBanner';
import { CategoryChipsPanel } from '../../components/CategoryChipsPanel/CategoryChipsPanel';
import { Card } from '../../components/Card/Card';
import { CardsGrid } from '../../components/CardsGrid/CardsGrid';
import { navigationConfig } from '../../config/navigation';
import { CategoryId } from '../../types/category';
import { ResourcesBySection } from '../../types/resource';

const TitleSection = styled.div`
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
  margin-top: -1rem;
  margin: 2rem 0 3rem;
  padding: 0 2rem 0 0;

  @media (max-width: 768px) {
    margin: 1.5rem 0 2rem;
    padding: 0;
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

const ErrorMessage = styled.div`
  color: var(--error-color);
  text-align: center;
  padding: 2rem;
  background: var(--error-background, #fff1f0);
  border-radius: 8px;
  margin: 2rem 0;
`;

const CardsContainer = styled.section`
  padding: 0 2rem 3rem;

  @media (max-width: 768px) {
    padding: 0 0 3rem;
  }
`;

interface HomeProps {
  loading: boolean;
  error: string;
  selectedCategories: CategoryId[];
  setSelectedCategories: (categories: CategoryId[]) => void;
  filteredResources: ResourcesBySection;
}

export const Home: FC<HomeProps> = ({
  loading,
  error,
  selectedCategories,
  setSelectedCategories,
  filteredResources
}) => {
  return (
    <>
      <TitleSection>
        <TitleContainer>
          <Title>ALLY.RU</Title>
          <Subtitle>каталог материалов по цифровой доступности</Subtitle>
        </TitleContainer>
        <StartBanner />
      </TitleSection>
      <CategoryChipsPanel
        selectedCategories={selectedCategories}
        onChange={setSelectedCategories}
      />
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <CardsContainer>
          <CardsGrid>
            {navigationConfig.map((item) => {
              const sectionKey = item.path.replace('/', '');
              return (
                <Card
                  key={item.path}
                  title={item.title}
                  path={item.path}
                  resources={filteredResources[sectionKey] || []}
                />
              );
            })}
          </CardsGrid>
        </CardsContainer>
      )}
    </>
  );
};