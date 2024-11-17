import { Suspense } from 'react';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { navigationConfig } from './config/navigation';
import {
  Articles,
  ArticlesDev,
  ArticlesDesign,
  ArticlesManagement,
  ArticlesQA,
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

const Container = styled.div`
  padding: 20px;
  background-color: var(--background-color);
  min-height: 100vh;
`;

const Title = styled.h1`
  color: var(--text-color);
  margin-bottom: 20px;
`;

function App() {
  return (
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
                    <CardsGrid>
                      {navigationConfig.map((item) => (
                        <Card
                          key={item.path}
                          title={item.title}
                          path={item.path}
                          children={item.children}
                          isNew={item.isNew}
                        />
                      ))}
                    </CardsGrid>
                  </>
                } />
                <Route path="/articles/dev" element={<ArticlesDev />} />
                <Route path="/articles/design" element={<ArticlesDesign />} />
                <Route path="/articles/management" element={<ArticlesManagement />} />
                <Route path="/articles/qa" element={<ArticlesQA />} />
                <Route path="/telegram" element={<Telegram />} />
                <Route path="/podcasts" element={<Podcasts />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/youtube" element={<YouTube />} />
                <Route path="/books" element={<Books />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/suggest" element={<Suggest />} />
              </Routes>
            </main>
          </Container>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
