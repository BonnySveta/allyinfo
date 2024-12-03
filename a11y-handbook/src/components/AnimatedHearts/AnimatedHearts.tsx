import styled, { keyframes } from 'styled-components';

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

interface HeartContainerProps {
  $isVisible: boolean;
}

const HeartContainer = styled.span<HeartContainerProps>`
  position: absolute;
  inset: -100px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;

  ${props => props.$isVisible && `
    opacity: 1;
  `}
`;

interface HeartProps {
  $isVisible: boolean;
}

const Heart = styled.span<HeartProps>`
  position: absolute;
  font-size: ${props => 0.8 + Math.random() * 0.7}rem;
  left: ${props => Math.random() * 100}%;
  top: ${props => Math.random() * 100}%;
  --tx: ${props => -70 + Math.random() * 140}px;
  --ty: ${props => -70 + Math.random() * 140}px;
  --rotate: ${props => Math.random() * 180}deg;
  opacity: 0;
  animation: ${floatingHearts} ${props => 2 + Math.random() * 2}s ease-in-out ${props => Math.random() * 1}s infinite;
  animation-play-state: ${props => props.$isVisible ? 'running' : 'paused'};
  z-index: 1;
`;

interface AnimatedHeartsProps {
  count?: number;
  isVisible?: boolean;
}

export function AnimatedHearts({ count = 4, isVisible = false }: AnimatedHeartsProps) {
  return (
    <HeartContainer $isVisible={isVisible}>
      {[...Array(count)].map((_, i) => (
        <Heart key={i} $isVisible={isVisible}>❤️</Heart>
      ))}
    </HeartContainer>
  );
} 