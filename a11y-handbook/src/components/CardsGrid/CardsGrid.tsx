import styled from 'styled-components';

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 2rem;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const CardsGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <CardsContainer>{children}</CardsContainer>;
}; 