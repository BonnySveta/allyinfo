import { Suspense } from 'react';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { navigationConfig } from './config/navigation';
import {
  Feedback,
  Suggest,
  ResourcePage
} from './pages/pages';
import { Header } from './components/Header/Header';
import { ThemeProvider } from './context/ThemeContext';
import { GlobalStyle } from '../src/styles/GlobalStyle';
import { Card } from './components/Card/Card';
import { CardsGrid } from './components/CardsGrid/CardsGrid';
import { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner';
import { Suggestions } from './pages/Admin/Suggestions';
import { ApprovedList } from './components/ApprovedList/ApprovedList';
import { AuthProvider } from './context/AuthContext';
import { useState, useEffect } from 'react';
import { Resource, ResourcesBySection } from './types/resource';
import { Support } from './pages/Support/Support';
import { AdminFeedbackList } from './pages/Admin/FeedbackList';
import { ResourceSection } from './pages/ResourcePage/config';
import { Footer } from './components/Footer/Footer';
import { StartBanner } from './components/StartBanner/StartBanner';
import { Admin } from './pages/Admin/Admin';
import { GettingStarted } from './pages/GettingStarted/GettingStarted';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: var(--background-color);
  display: flex;
  flex-direction: column;
`;

const MainContainer = styled.div`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding-top: calc(24px + 2rem);
  }
`;

const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
  padding: 0 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    margin: 1.5rem 0 2rem;
    padding: 0;
  }
`;

const TitleContainer = styled.div`
  margin-top: -1rem;
  margin: 2rem 0 3rem;
  padding: 0 2rem;

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

interface ApiResponse {
  items: Resource[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Обновляем конфигурацию страниц
const pageConfig = {
  articles: { path: '/articles', title: 'Статьи' },
  telegram: { path: '/telegram', title: 'Telegram-каналы' },
  podcasts: { path: '/podcasts', title: 'Подкасты' },
  courses: { path: '/courses', title: 'Курсы' },
  youtube: { path: '/youtube', title: 'YouTube-каналы' },
  books: { path: '/books', title: 'Книги' },
  resources: { path: '/resources', title: 'Ресурсы' },
};

function App() {
  const [resources, setResources] = useState<ResourcesBySection>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        
        // Загружаем все одобренные материалы (без пагинации)
        const params = new URLSearchParams({
          status: 'approved',
          sortBy: 'date',
          order: 'desc',
          limit: '100', 
          page: '1'
        });

        const response = await fetch(`http://localhost:3001/api/suggestions?${params}`);
        const data = await response.json();
        
        const transformedData = data.items.map((item: any) => ({
          id: item.id,
          url: item.url,
          section: item.section,
          description: item.description,
          createdAt: item.created_at,
          preview: {
            title: item.preview_title,
            description: item.preview_description,
            image: item.preview_image,
            favicon: item.preview_favicon,
            domain: item.preview_domain
          }
        }));

        const grouped = transformedData.reduce((acc: ResourcesBySection, item: Resource) => {
          if (!acc[item.section]) {
            acc[item.section] = [];
          }
          acc[item.section].push(item);
          return acc;
        }, {});

        setResources(grouped);
        setLoading(false);
      } catch (err) {
        setError('Не удалось загрузить ресурсы');
        console.error(err);
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <GlobalStyle />
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <PageContainer>
              <Header />
              <MainContainer>
                <main>
                  <Routes>
                    <Route path="/" element={
                      <>
                        <TitleSection>
                          <TitleContainer>
                            <Title>ALLY WIKI</Title>
                            <Subtitle>справочник цифровой доступности</Subtitle>
                          </TitleContainer>
                          <StartBanner />
                        </TitleSection>
                        {loading ? (
                          <LoadingSpinner />
                        ) : error ? (
                          <ErrorMessage>{error}</ErrorMessage>
                        ) : (
                          <CardsGrid>
                            {navigationConfig.map((item) => (
                              <Card
                                key={item.path}
                                title={item.title}
                                path={item.path}
                                resources={resources[item.section] || []}
                              />
                            ))}
                          </CardsGrid>
                        )}
                      </>
                    } />
                    {Object.entries(pageConfig).map(([key, config]) => (
                      <Route 
                        key={config.path}
                        path={config.path}
                        element={
                          <ResourcePage 
                            section={key as ResourceSection}
                          />
                        }
                      />
                    ))}
                    <Route path="/feedback" element={<Feedback />} />
                    <Route path="/suggest" element={<Suggest />} />
                    <Route path="/admin/suggestions" element={<Suggestions />} />
                    <Route path="/admin/approved" element={<ApprovedList />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/admin/feedback-list" element={<AdminFeedbackList />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/getting-started" element={<GettingStarted />} />
                  </Routes>
                </main>
              </MainContainer>
              <Footer />
            </PageContainer>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
