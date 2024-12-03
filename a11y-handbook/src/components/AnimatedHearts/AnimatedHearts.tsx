import styled, { keyframes } from 'styled-components';

const floatingHearts = keyframes`
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0) rotate(0deg);
  }
  // ... остальная анимация ...
`;

const HeartContainer = styled.span`
  position: absolute;
  inset: -100px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
`;

const Heart = styled.span<{ isVisible?: boolean }>`
  position: absolute;
  font-size: ${props => 0.8 + Math.random() * 0.7}rem;
  // ... остальные стили ...
`;

interface AnimatedHeartsProps {
  count?: number;
}

export function AnimatedHearts({ count = 4 }: AnimatedHeartsProps) {
  return (
    <HeartContainer>
      {[...Array(count)].map((_, i) => (
        <Heart key={i} isVisible={true}>❤️</Heart>
      ))}
    </HeartContainer>
  );
} 