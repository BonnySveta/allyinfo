import { PaymentMethod } from '../../components/PaymentMethod/PaymentMethod';
import { Container, Title, Section, SectionTitle, Text, PaymentMethods, StyledLink } from './styles';
import yMoneyQR from '../../assets/y-money.svg';
import vtbQR from '../../assets/vtb.svg';

export function Support() {
  return (
    <Container>
      <Title>Поддержать проект</Title>
      
      <Section>
        <Text>
          ALLYINFO — это некоммерческий проект,
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
          <PaymentMethod 
            title="Перевод с карты"
            qrCode={yMoneyQR}
            qrAlt="QR код для перевода через ЮMoney"
            link="https://yoomoney.ru/quickpay/fundraise/button?billNumber=16T1MFGPCDV.241203"
            linkText="Перевести через ЮMoney"
            heartsCount={4}
          />
          <PaymentMethod 
            title="Перевод ВТБ"
            qrCode={vtbQR}
            qrAlt="QR код для перевода через ВТБ"
            link="https://vtb.paymo.ru/vtb/collect-money/?transaction=b43ec112-94f0-4e5c-a863-12ff6cd506cd"
            linkText="Перевести через ВТБ"
            heartsCount={6}
          />
        </PaymentMethods>
      </Section>

      <Section>
        <SectionTitle>Как ещё вы можете помочь</SectionTitle>
        <Text>
          • Предложить полезный материал через <StyledLink to="/suggest">форму на сайте</StyledLink><br />
          • Рассказать о проекте коллегам и друзьям<br />
          • Поддержать проект финансово
        </Text>
      </Section>
    </Container>
  );
} 