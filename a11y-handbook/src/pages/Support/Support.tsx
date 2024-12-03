import styled, { keyframes, css } from 'styled-components';
import yMoneyQR from '../../assets/y-money.svg';
import vtbQR from '../../assets/vtb.svg';
import { Link } from 'react-router-dom';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  color: var(--text-primary);
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  color: var(--text-primary);
  margin-bottom: 1rem;
`;

const Text = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const PaymentMethods = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
`;

const floatingHearts = keyframes`
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0) rotate(0deg);
  }
  20% {
    opacity: 1;
    transform: translate(calc(var(--tx) * 0.2), calc(var(--ty) * 0.2)) scale(1) rotate(calc(var(--rotate) * 0.2));
  }
  80% {
    opacity: 1;
    transform: translate(calc(var(--tx) * 0.8), calc(var(--ty) * 0.8)) scale(0.9) rotate(calc(var(--rotate) * 0.8));
  }
  100% {
    opacity: 0;
    transform: translate(var(--tx), var(--ty)) scale(0) rotate(var(--rotate));
  }
`;

const PaymentMethod = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  background: var(--background-secondary);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  overflow: visible;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const HeartContainer = styled.span`
  position: absolute;
  inset: -100px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;

  ${PaymentMethod}:hover & {
    opacity: 1;
  }
`;

const Heart = styled.span<{ isVisible?: boolean }>`
  position: absolute;
  font-size: ${props => 0.8 + Math.random() * 0.7}rem;
  left: ${props => Math.random() * 100}%;
  top: ${props => Math.random() * 100}%;
  --tx: ${props => -70 + Math.random() * 140}px;
  --ty: ${props => -70 + Math.random() * 140}px;
  --rotate: ${props => Math.random() * 180}deg;
  opacity: 0;
  animation: ${floatingHearts} ${props => 2 + Math.random() * 2}s ease-in-out ${props => Math.random() * 1}s infinite;
  animation-play-state: ${props => props.isVisible ? 'running' : 'paused'};
  z-index: 1;
`;

const PaymentMethodTitle = styled.h3`
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  text-align: center;
`;

const PaymentSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
`;

const QRCode = styled.img`
  width: 220px;
  height: 220px;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const PaymentLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--accent-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  width: 330px;
  max-width: 100%;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const VTBLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--accent-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  width: 330px;
  max-width: 100%;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

const StyledLink = styled(Link)`
  color: var(--accent-color);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export function Support() {
  return (
    <Container>
      <Title>Поддержать проект</Title>
      
      <Section>
        <Text>
          ALLY WIKI — это некоммерческий проект, 
          который развивается силами сообщества. Мы собираем и систематизируем 
          материалы, чтобы сделать веб доступнее для всех.
        </Text>
      </Section>

      <Section>
        <SectionTitle>Финансовая поддержка</SectionTitle>
        <Text>
          Ваша поддержка поможет нам развивать проект, добавлять новые 
          материалы и улучшать функциональность сайта.
        </Text>
        
        <PaymentMethods>
          <PaymentMethod>
            <HeartContainer>
              {[...Array(4)].map((_, i) => (
                <Heart key={i} isVisible={true}>❤️</Heart>
              ))}
            </HeartContainer>
            <PaymentMethodTitle>Перевод с карты</PaymentMethodTitle>
            <PaymentSection>
              <PaymentLink 
                href="https://yoomoney.ru/quickpay/fundraise/button?billNumber=16T1MFGPCDV.241203"
                target="_blank"
                rel="noopener noreferrer"
              >
                Перевести через ЮMoney
              </PaymentLink>
              <QRCode src={yMoneyQR} alt="QR код для перевода через ЮMoney" />
            </PaymentSection>
          </PaymentMethod>

          <PaymentMethod>
            <HeartContainer>
              {[...Array(6)].map((_, i) => (
                <Heart key={i} isVisible={true}>❤️</Heart>
              ))}
            </HeartContainer>
            <PaymentMethodTitle>Перевод ВТБ</PaymentMethodTitle>
            <PaymentSection>
              <VTBLink 
                href="https://vtb.paymo.ru/vtb/collect-money/?transaction=b43ec112-94f0-4e5c-a863-12ff6cd506cd"
                target="_blank"
                rel="noopener noreferrer"
              >
                Перевести через ВТБ
              </VTBLink>
              <QRCode src={vtbQR} alt="QR код для перевода через ВТБ" />
            </PaymentSection>
          </PaymentMethod>
        </PaymentMethods>
      </Section>

      <Section>
        <SectionTitle>Как вы можете помочь</SectionTitle>
        <Text>
          • Предложить полезный материал через <StyledLink to="/suggest">форму на сайте</StyledLink><br />
          • Рассказать о проекте коллегам и друзьям<br />
          • Поддержать проект финансово
        </Text>
      </Section>
      
    </Container>
  );
} 