import { PaymentMethod } from '../../components/PaymentMethod/PaymentMethod';
import { Container, Title, Section, SectionTitle, Text, PaymentMethods, StyledLink } from './styles';
import yMoneyQR from '../../assets/y-money.svg';
import vtbQR from '../../assets/VTB.jpg';
import { FaTelegram } from 'react-icons/fa';
import styled from 'styled-components';
import BondarenkoS from '../../assets/avatars/svetlana_bondarenko.jpg';
import ZhilkinD from '../../assets/avatars/denis_zhilkin.jpg';
import KochegarovaE from '../../assets/avatars/elena_kochegarova.jpg';
import ChigarevA from '../../assets/avatars/anton_chigarev.jpg';
import BondarenkoE from '../../assets/avatars/evgeniy_bondarenko.jpg';
import GermanA from '../../assets/avatars/angelica_german.jpg';
import { scrollToTop } from '../../utils/scrollOnTop';

const TeamGrid = styled.ul`
  list-style-type: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 0;
  padding-inline-start: 0;
  justify-items: center;
`;

const TeamCard = styled.li`
  display: flex;
  align-items: center;
  background: var(--card-background);
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  max-width: 340px;
  width: 100%;
`;

const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #b98aff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  user-select: none;
  flex-shrink: 0;
  overflow: hidden;
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const Info = styled.a`
  margin-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const Name = styled.span`
  font-weight: 600;
  color: var(--text-color);
`;

const Role = styled.span`
  color: var(--text-secondary-color);
  font-size: 0.95rem;
`;

const TelegramLink = styled.span`
  color: #229ed9;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.95rem;
  text-decoration: none;
  margin-top: 0.2rem;
  &:hover {
    text-decoration: underline;
  }
`;

const team = [
  {
    name: 'Светлана Бондаренко',
    initials: 'СВ',
    role: 'Создатель проекта',
    telegram: 'bonnysveta',
    avatar: BondarenkoS,
  },
  {
    name: 'Денис Жилкин',
    initials: 'ДЖ',
    role: 'DevOps-инженер',
    telegram: 'dezorden',
    avatar: ZhilkinD,
  },
  {
    name: 'Елена Кочегарова',
    initials: 'ЕК',
    role: 'Фронтенд-разработчик',
    telegram: 'elenakoch122',
    avatar: KochegarovaE,
  },
  {
    name: 'Антон Чигарёв',
    initials: 'АЧ',
    role: 'Тестировщик невизуальной доступности',
    telegram: 'Ant0n_56',
    avatar: ChigarevA,
  },
  // {
  //   name: 'Евгений Бондаренко',
  //   initials: 'ЕБ',
  //   role: 'Художник, автор маскота Элли',
  //   telegram: 'Opename',
  //   avatar: BondarenkoE,
  // },
  {
    name: 'Анжелика Герман',
    initials: 'АГ',
    role: 'Веб-дизайнер',
    telegram: 'AnzhelikaGerman',
    avatar: GermanA,
  },
  // Добавьте ещё участников по мере необходимости
];

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
          {/* <PaymentMethod
            title="Перевод ЮMoney"
            qrCode={yMoneyQR}
            method="ЮMoney"
            link="https://yoomoney.ru/quickpay/fundraise/button?billNumber=16T1MFGPCDV.241203"
            linkText="Перевести через ЮMoney"
            heartsCount={4}
          /> */}
          <PaymentMethod
            title="Перевод ВТБ"
            qrCode={vtbQR}
            method="ВТБ"
            link="https://vtb.paymo.ru/vtb/collect-money/?transaction=63c945d6-5b30-49bb-b7b0-61b1962de1f7"
            linkText="Перевести через ВТБ"
            heartsCount={6}
          />
        </PaymentMethods>
      </Section>

      <Section>
        <SectionTitle>Наша команда</SectionTitle>
        <Text>
          Ally Team — это команда энтузиастов, которые верят в важность цифровой доступности и делают этот проект возможным. Каждый из нас вносит свой вклад, чтобы сделать интернет удобнее и понятнее для всех.
        </Text>
        <TeamGrid>
          {team.map((member, idx) => (
            <TeamCard key={idx}>
              <Avatar>{member.avatar ? <AvatarImg src={member.avatar} alt="" /> : member.initials}</Avatar>
              <Info href={`https://t.me/${member.telegram}`} target="_blank" rel="noopener noreferrer">
                <Name role="presentation">{member.name}</Name>
                <Role role="presentation">{member.role}</Role>
                {member.telegram && (
                  <TelegramLink aria-hidden="true">
                    <FaTelegram />@{member.telegram}
                  </TelegramLink>
                )}
              </Info>
            </TeamCard>
          ))}
        </TeamGrid>
      </Section>

      <Section>
        <SectionTitle>Как ещё вы можете помочь</SectionTitle>
        <Text>
          • Предложить полезный материал через <StyledLink to="/suggest" onClick={scrollToTop}>форму на сайте</StyledLink><br />
          • Рассказать о проекте коллегам и друзьям<br />
          • Поддержать проект финансово
        </Text>
      </Section>
    </Container>
  );
} 