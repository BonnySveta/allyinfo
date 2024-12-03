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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <PaymentMethodContainer 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatedHearts count={heartsCount} isVisible={isHovered} />
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