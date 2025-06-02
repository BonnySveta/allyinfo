import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { FocusOverlayProvider } from './context/FocusOverlayContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { FocusProvider } from './context/FocusContext';
import { GlobalStyle } from './styles/GlobalStyle';
import { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import MaterialsAdmin from './components/MaterialsAdmin/MaterialsAdmin';
import { FilterChipsPanel } from './components/FilterChips';
import { Feedback, Suggest, ResourcePage } from './pages/pages';
import { Home } from './pages/Home/Home';
import { AdminFeedbackList } from './pages/Admin/FeedbackList';
import { Login } from './pages/Login/Login';
import { Admin } from './pages/Admin/Admin';
import { GettingStarted } from './pages/GettingStarted/GettingStarted';
import { ResourceSection } from './pages/ResourcePage/config';
import { Support } from './pages/Support/Support';
import { useResources, UseResourcesHomeResult } from './hooks/useResources';

const MainContainer = styled.main`
  flex: 1 0 auto;
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
  blogs: { path: '/blogs', title: 'Блоги' },
  guides: { path: '/guides', title: 'Руководства' },
  telegram: { path: '/telegram', title: 'Telegram-каналы' },
  podcasts: { path: '/podcasts', title: 'Подкасты' },
  courses: { path: '/courses', title: 'Курсы' },
  video: { path: '/video', title: 'Видео' },
  books: { path: '/books', title: 'Книги' },
  tools: { path: '/tools', title: 'Инструменты' },
};

function App() {
  const result = useResources();
  const {
    loading,
    error,
    selectedCategories,
    setSelectedCategories,
    filteredResources,
    categories
  } = result as UseResourcesHomeResult;

  return (
    <FocusOverlayProvider>
      <AuthProvider>
        <ThemeProvider>
          <FocusProvider>
            <GlobalStyle />
            <BrowserRouter>
              <Suspense fallback={<LoadingSpinner />}>
                <Header />
                <MainContainer>
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
                          categories={categories}
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
                      path="/admin/materials"
                      element={
                        <ProtectedRoute showError>
                          <MaterialsAdmin />
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
                </MainContainer>
                <Footer />
              </Suspense>
            </BrowserRouter>
          </FocusProvider>
        </ThemeProvider>
      </AuthProvider>
    </FocusOverlayProvider>
  );
}

export default App;
