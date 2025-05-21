import styled from 'styled-components';

const SkeletonElement = styled.div`
  background: linear-gradient(
    90deg,
    var(--nav-hover-background) 0%,
    var(--banner-background) 50%,
    var(--nav-hover-background) 100%
  );
  background-size: 200% 100%;
  border-radius: 4px;
  animation: skeletonPulse 1.5s ease-in-out infinite;
  opacity: 0.8;

  @keyframes skeletonPulse {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  margin?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ width, height, margin, style }: SkeletonProps) {
  return (
    <SkeletonElement
      style={{
        width,
        height,
        margin,
        ...style
      }}
    />
  );
} 