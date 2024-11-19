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

function App() {
  const [resources, setResources] = useState<ResourcesBySection>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/suggestions');
        if (!response.ok) throw new Error('Failed to fetch resources');
        
        const data: Resource[] = await response.json();
        
        // Группируем ресурсы по разделам
        const grouped = data.reduce((acc: ResourcesBySection, resource) => {
          const section = resource.section.replace(/^\//, '');
          if (!acc[section]) {
            acc[section] = [];
          }
          acc[section].push(resource);
          return acc;
        }, {});

        setResources(grouped);
      } catch (err) {
        setError('Не удалось загрузить ресурсы');
        console.error(err);
      } finally {
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
                          {navigationConfig.map((item) => (
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
                          ))}
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
