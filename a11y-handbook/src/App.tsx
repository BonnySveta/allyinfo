import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider } from './context/ThemeContext';
import { GlobalStyle } from './styles/GlobalStyle';
import { AuthProvider } from './context/AuthContext';
import { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Home } from './pages/Home/Home';
import { useResources, UseResourcesHomeResult } from './hooks/useResources';
import {
  Feedback,
  Suggest,
  ResourcePage
} from './pages/pages';
import { Suggestions } from './pages/Admin/Suggestions';
import { ApprovedList } from './pages/Admin/ApprovedList';
import { Support } from './pages/Support/Support';
import { AdminFeedbackList } from './pages/Admin/FeedbackList';
import { Login } from './pages/Login/Login';
import { Admin } from './pages/Admin/Admin';
import { GettingStarted } from './pages/GettingStarted/GettingStarted';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { CategoryChips } from './components/CategoryChips/CategoryChips';
import { CATEGORIES, CategoryId } from './types/category';
import { CategoryChipsPanel } from './components/CategoryChipsPanel/CategoryChipsPanel';
import { ResourceSection } from './pages/ResourcePage/config';
import { FocusOverlayProvider } from './context/FocusOverlayContext';

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
  const result = useResources();
  const {
    loading,
    error,
    selectedCategories,
    setSelectedCategories,
    filteredResources
  } = result as UseResourcesHomeResult;

  return (
    <FocusOverlayProvider>
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
                      <Route 
                        path="/" 
                        element={
                          <Home
                            loading={loading}
                            error={error}
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                            filteredResources={filteredResources}
                          />
                        } 
                      />
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
                      <Route 
                        path="/admin/suggestions" 
                        element={
                          <ProtectedRoute showError>
                            <Suggestions />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin/approved" 
                        element={
                          <ProtectedRoute>
                            <ApprovedList />
                          </ProtectedRoute>
                        } 
                      />
                      <Route path="/support" element={<Support />} />
                      <Route path="/admin/feedback-list" element={<AdminFeedbackList />} />
                      <Route path="/login" element={<Login />} />
                      <Route 
                        path="/admin/*" 
                        element={
                          <ProtectedRoute>
                            <Admin />
                          </ProtectedRoute>
                        } 
                      />
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
    </FocusOverlayProvider>
  );
}

export default App;
