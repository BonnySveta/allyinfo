import { AnimatedHearts } from '../AnimatedHearts/AnimatedHearts';
import {
  PaymentMethodContainer,
  PaymentMethodTitle,
  PaymentSection,
  PaymentLink,
  QRCode
} from './styles';

interface PaymentMethodProps {
  title: string;
  qrCode: string;
  qrAlt: string;
  link: string;
  linkText: string;
  heartsCount?: number;
}

export function PaymentMethod({
  title,
  qrCode,
  qrAlt,
  link,
  linkText,
  heartsCount = 4
}: PaymentMethodProps) {
  return (
    <PaymentMethodContainer>
      <AnimatedHearts count={heartsCount} />
      <PaymentMethodTitle>{title}</PaymentMethodTitle>
      <PaymentSection>
        <PaymentLink 
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkText}
        </PaymentLink>
        <QRCode src={qrCode} alt={qrAlt} />
      </PaymentSection>
    </PaymentMethodContainer>
  );
} 