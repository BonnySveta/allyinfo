import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { StartBanner } from '../../components/StartBanner/StartBanner';
import { FilterChipsPanel } from '../../components/FilterChips';
import { Card, SkeletonCard } from '../../components/Card/Card';
import { CardsGrid } from '../../components/CardsGrid/CardsGrid';
import { navigationConfig } from '../../config/navigation';
import { CategoryId } from '../../types/category';
import { ResourcesBySection } from '../../types/resource';
import { speechService } from '../../services/speech';
import { useFocusOverlay } from '../../context/FocusOverlayContext';
import { fetchSections } from '../../services/supabase';
import { pageConfig } from '../ResourcePage/config';

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

const CardsContainer = styled.section.attrs({
  className: 'CardsContainer'
})`
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
  categories: any[];
}

export const Home: FC<HomeProps> = ({
  loading,
  error,
  selectedCategories,
  setSelectedCategories,
  filteredResources,
  categories
}) => {
  const { announceUpdate } = useFocusOverlay();
  const [sections, setSections] = useState<any[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);

  useEffect(() => {
    async function loadSections() {
      setSectionsLoading(true);
      try {
        const secs = await fetchSections();
        setSections(secs);
      } catch (e) {
        setSections([]);
      } finally {
        setSectionsLoading(false);
      }
    }
    loadSections();
  }, []);

  useEffect(() => {
    if (!loading && !error) {
      const totalResources = Object.values(filteredResources)
        .reduce((sum, resources) => sum + resources.length, 0);

      let announcement = '';
      if (selectedCategories.length > 0) {
        if (totalResources === 0) {
          announcement = 'По выбранным фильтрам ничего не найдено';
        } else {
          announcement = `Найдено ${totalResources} материалов`;
        }
      } else if (totalResources > 0) {
        announcement = `Показаны все ${totalResources} материалов`;
      }

      if (announcement) {
        announceUpdate(announcement);
      }
    }
  }, [filteredResources, selectedCategories, loading, error, announceUpdate]);

  return (
    <>
      <TitleSection>
        <TitleContainer>
          <Title>ALLYINFO</Title>
          <Subtitle>каталог материалов цифровой доступности</Subtitle>
        </TitleContainer>
        <StartBanner />
      </TitleSection>
      <FilterChipsPanel
        categories={categories}
        selectedCategories={selectedCategories}
        onChange={setSelectedCategories}
      />
      {loading || sectionsLoading ? (
        <CardsContainer>
          <CardsGrid>
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </CardsGrid>
        </CardsContainer>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <CardsContainer>
          <CardsGrid>
            {sections.map(section => {
              const config = pageConfig[section.slug as keyof typeof pageConfig];
              const path = config ? config.path : `/${section.slug}`;
              
              // Определяем текст для ссылки "Все материалы" в зависимости от типа секции
              const viewAllText = section.slug === 'books' ? 'Все книги' :
                                section.slug === 'articles' ? 'Все статьи' :
                                section.slug === 'telegram' ? 'Все каналы' :
                                section.slug === 'podcasts' ? 'Все подкасты' :
                                section.slug === 'courses' ? 'Все курсы' :
                                section.slug === 'youtube' ? 'Все видео' :
                                'Все материалы';

              return (
                <Card
                  key={section.id}
                  title={section.label}
                  path={path}
                  resources={filteredResources[section.id] || []}
                  viewAllText={viewAllText}
                />
              );
            })}
          </CardsGrid>
        </CardsContainer>
      )}
    </>
  );
};