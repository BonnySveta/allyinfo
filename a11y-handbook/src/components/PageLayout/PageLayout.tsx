import styled from 'styled-components';

const Container = styled.div`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--text-color);
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <Container>
      {children}
    </Container>
  );
} 