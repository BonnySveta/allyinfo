import { useState } from 'react';
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
  method: string;
  link: string;
  linkText: string;
  heartsCount?: number;
}

export function PaymentMethod({
  title,
  qrCode,
  method,
  link,
  linkText,
  heartsCount = 4
}: PaymentMethodProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <PaymentMethodContainer 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatedHearts count={heartsCount} isVisible={isHovered} />
      <PaymentMethodTitle aria-hidden="true">{title}</PaymentMethodTitle>
      <PaymentSection>
        <QRCode src={qrCode} alt="" />
        <PaymentLink 
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Поддержать
          <span className="visually-hidden" role="presentation">с помощью {method}</span>
        </PaymentLink>
      </PaymentSection>
    </PaymentMethodContainer>
  );
} 