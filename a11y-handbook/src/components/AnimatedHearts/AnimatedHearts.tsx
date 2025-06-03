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
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.2s;
`;

interface HeartProps {
  $isVisible: boolean;
}

const HEART_SIZE_MIN = 0.8;
const HEART_SIZE_MAX = 1.5;
const HEART_POSITION = 100;
const HEART_CHANGE = 140;
const HEART_ROTATION = 180;
const HEART_DURATION_MIN = 2;
const HEART_DURATION_MAX = 4;

const Heart = styled.span<HeartProps>`
  position: absolute;
  font-size: ${props => Math.random() * (HEART_SIZE_MAX - HEART_SIZE_MIN) + HEART_SIZE_MIN }rem;
  left: ${props => Math.random() * HEART_POSITION}%;
  top: ${props => Math.random() * HEART_POSITION}%;
  --tx: ${props => Math.random() * HEART_CHANGE - HEART_CHANGE / 2}px;
  --ty: ${props => Math.random() * HEART_CHANGE - HEART_CHANGE / 2}px;
  --rotate: ${props => Math.random() * HEART_ROTATION}deg;
  opacity: 0;
  animation: ${floatingHearts} ${props => Math.random() * (HEART_DURATION_MAX - HEART_DURATION_MIN) + HEART_DURATION_MIN}s ease-in-out ${props => Math.random()}s infinite;
  animation-play-state: ${props => props.$isVisible ? 'running' : 'paused'};
  z-index: 1;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

interface AnimatedHeartsProps {
  count?: number;
  isVisible?: boolean;
}

export function AnimatedHearts({ count = 4, isVisible = false }: AnimatedHeartsProps) {
  return (
    <HeartContainer $isVisible={isVisible} aria-hidden="true">
      {[...Array(count)].map((_, i) => (
        <Heart key={i} $isVisible={isVisible}>❤️</Heart>
      ))}
    </HeartContainer>
  );
} 