import styled from 'styled-components';
import { PageLayout } from '../../components/PageLayout/PageLayout';
import { Link } from 'react-router-dom';
import { Banner } from '../../components/Banner/Banner';

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  color: var(--text-color);
  margin-bottom: 1rem;
`;

const Text = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const List = styled.ul`
  color: var(--text-secondary);
  margin-bottom: 2rem;
  padding-left: 1.2em;
`;

const ListItem = styled.li`
  margin-bottom: 0.7em;
`;

const TopGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: start;
  margin-bottom: 2.5rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const Headings = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

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
  max-width: 480px;

  @media (max-width: 768px) {
    margin: 1.5rem 0 2rem;
    padding: 0;
    max-width: 100%;
  }
`;

const MainTitle = styled.h1`
  font-size: 2.5rem;
  color: var(--text-color);
  margin-bottom: 0.5rem;
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  color: var(--text-secondary-color);
  margin: 0;
  font-weight: 400;
  @media (max-width: 768px) {
    font-size: 1.05rem;
  }
`;

export function GettingStarted() {
  return (
    <>
      <PageLayout>
        <TitleSection>
          <TitleContainer>
            <MainTitle>Начинающим</MainTitle>
            <Subtitle>Базовые материалы и советы для старта в цифровой доступности</Subtitle>
          </TitleContainer>
          <Banner
            title="Нет времени изучать?"
            text={<>Если вам нужен аудит или есть вопросы по реализации доступности — напишите нам: <a href="https://t.me/bonnysveta" target="_blank" rel="noopener noreferrer">@bonnysveta</a></>}
            emoji="⏳"
          />
        </TitleSection>
        <Section>
          <Text>
            Добро пожаловать! <br /> Если вы только начинаете знакомство с цифровой доступностью, начните с этих базовых материалов.<br /> Они помогут разобраться в основных понятиях, терминах и принципах доступности.
            <br />Эти материалы подходят для изучения не зависимо от конкретной специальности.
          </Text>
          <SectionTitle>Базовые материалы по цифровой доступности</SectionTitle>
          <List>
            <ListItem>
              <a href="https://trends.rbc.ru/trends/social/63aa999c9a79471fb4e0c276" target="_blank" rel="noopener noreferrer">
                Полный доступ: что такое цифровая доступность и почему она нужна всем
              </a> — статья, краткое введение и зачем это нужно.
            </ListItem>
            <ListItem>
              <a href="https://guides.kontur.ru/principles/accessibility/accessibility/" target="_blank" rel="noopener noreferrer">
                Принципы доступности
              </a> — статья, виды ограничений и основные принципы.
            </ListItem>
            <ListItem>
              <a href="https://vkvideo.ru/video-147415323_456239661?ref_domain=yastatic.net" target="_blank" rel="noopener noreferrer">
                Как незрячие пользуются компьютером? Работа со скринридером
              </a> — видео (VK Видео).
            </ListItem>
            <ListItem>
              <a href="https://shepherd.org/ru/treatment/services-clinics/center-for-assistive-technologies/what-is-assistive-technology/" target="_blank" rel="noopener noreferrer">
                Что такое вспомогательные технологии
              </a> — статья (Shepherd Center).
            </ListItem>
          </List>
          <Text>
            Если у вас есть предложения по материалам для начинающих — напишите нам через страницу <Link to="/feedback">Обратная связь</Link>!
          </Text>
        </Section>
      </PageLayout>
    </>
  );
} 