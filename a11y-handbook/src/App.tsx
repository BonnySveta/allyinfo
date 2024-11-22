import { Suspense } from 'react';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { navigationConfig } from './config/navigation';
import {
  Articles,
  Telegram,
  Podcasts,
  Courses,
  YouTube,
  Books,
  Feedback,
  Suggest
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

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: var(--background-color);
  min-height: 100vh;
`;

const Title = styled.h1`
  color: var(--text-color);
  margin-bottom: 20px;
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

function App() {
  const [resources, setResources] = useState<ResourcesBySection>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/suggestions');
        const data = await response.json();
        
        const transformedData = data.items.map((item: any) => ({
          ...item,
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

  console.log('Current resources state:', resources);
  console.log('Navigation config:', navigationConfig);

  return (
    <AuthProvider>
      <ThemeProvider>
        <GlobalStyle />
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Container>
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={
                    <>
                      <Title>Справочник по цифровой доступности</Title>
                      {loading ? (
                        <LoadingSpinner />
                      ) : error ? (
                        <ErrorMessage>{error}</ErrorMessage>
                      ) : (
                        <CardsGrid>
                          {navigationConfig.map((item) => {
                            console.log(`Resources for ${item.section}:`, resources[item.section]);
                            return (
                              <Link 
                                to={item.path} 
                                key={item.path} 
                                style={{ textDecoration: 'none' }}
                              >
                                <Card
                                  title={item.title}
                                  path={item.path}
                                  resources={resources[item.section] || []}
                                />
                              </Link>
                            );
                          })}
                        </CardsGrid>
                      )}
                    </>
                  } />
                  <Route path="/articles" element={<Articles resources={resources['articles'] || []} />} />
                  <Route path="/telegram" element={<Telegram resources={resources['telegram'] || []} />} />
                  <Route path="/podcasts" element={<Podcasts resources={resources['podcasts'] || []} />} />
                  <Route path="/courses" element={<Courses resources={resources['courses'] || []} />} />
                  <Route path="/youtube" element={<YouTube resources={resources['youtube'] || []} />} />
                  <Route path="/books" element={<Books resources={resources['books'] || []} />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/suggest" element={<Suggest />} />
                  <Route path="/admin/suggestions" element={<Suggestions />} />
                  <Route path="/admin/approved" element={<ApprovedList />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/admin/feedback-list" element={<AdminFeedbackList />} />
                </Routes>
              </main>
            </Container>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
