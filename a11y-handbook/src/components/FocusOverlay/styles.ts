import styled from 'styled-components';
import { SpotlightPosition } from './types';

export const Spotlight = styled.div<{ 
  $position: SpotlightPosition; 
  $isModal?: boolean; 
  $isLive?: boolean;
  $hasFlow?: boolean;
}>`
  position: fixed;
  top: ${props => props.$position.top}px;
  left: ${props => props.$position.left}px;
  width: ${props => props.$position.width}px;
  height: ${props => props.$position.height}px;
  background: transparent;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.9);
  z-index: 9999;
  pointer-events: none;
  border: 2px solid ${props => {
    if (props.$isModal) return '#FF4081';
    if (props.$isLive) return '#8BC34A';
    if (props.$hasFlow) return '#FFC107';
    return '#4A90E2';
  }};
  border-radius: 4px;

  ${props => props.$isModal && `
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.95);
    &::before {
      content: '🔒';
      position: absolute;
      top: -20px;
      right: -20px;
      font-size: 16px;
    }
  `}

  ${props => props.$isLive && `
    animation: pulse 2s infinite;
    &::before {
      content: '🔄';
      position: absolute;
      top: -20px;
      right: -20px;
      font-size: 16px;
      animation: spin 2s linear infinite;
    }
  `}

  ${props => props.$hasFlow && `
    &::after {
      content: '↪';
      position: absolute;
      bottom: -20px;
      right: -20px;
      font-size: 16px;
      animation: bounce 1s ease infinite;
    }
  `}

  @keyframes pulse {
    0% { border-color: #8BC34A; box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.9), 0 0 0 2px #8BC34A; }
    50% { border-color: #4CAF50; box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.9), 0 0 10px 2px #4CAF50; }
    100% { border-color: #8BC34A; box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.9), 0 0 0 2px #8BC34A; }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
`;

export const InfoPanel = styled.div<{ $position: SpotlightPosition }>`
  position: absolute;
  top: ${props => props.$position.top + props.$position.height + 8}px;
  left: ${props => props.$position.left}px;
  background: #4A90E2;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 10000;
  max-width: 300px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 16px;
    border-style: solid;
    border-width: 0 8px 8px 8px;
    border-color: transparent transparent #4A90E2 transparent;
  }

  & > div {
    margin-bottom: 8px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  .screen-reader-text {
    margin-bottom: 8px;
    font-size: 14px;
  }

  .technical-info {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
  }
`;

export const InfoText = styled.div`
  margin: 4px 0;

  .screen-reader-text {
    font-size: 14px;
    margin-bottom: 12px;
  }

  .technical-info {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
  }
`;

export const ShortcutsList = styled.div`
  margin-top: 8px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-size: 12px;
`;

export const Shortcut = styled.span`
  display: inline-block;
  margin-right: 12px;
  color: rgba(255, 255, 255, 0.9);
  
  &:last-child {
    margin-right: 0;
  }
`;

export const GlobalHintsContainer = styled.div<{ $isCollapsed: boolean }>`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: ${props => props.$isCollapsed ? '12px' : '20px'};
  border-radius: 8px;
  font-size: 14px;
  z-index: 10001;
  min-width: ${props => props.$isCollapsed ? '40px' : '280px'};
  max-width: ${props => props.$isCollapsed ? '40px' : '400px'};
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  pointer-events: none;
  
  * {
    pointer-events: auto;
  }
`;

export const ButtonWrapper = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
  pointer-events: all;
  user-select: none;
`;

export const CollapseButton = styled.div<{ $isCollapsed: boolean }>`
  background: transparent;
  color: #4A90E2;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(${props => props.$isCollapsed ? '180deg' : '0deg'});
  transition: transform 0.3s ease;
  
  &:hover {
    color: white;
  }
`;

export const CollapsedIndicator = styled.div`
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  color: #4A90E2;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const HintsSection = styled.div`
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const HintsTitle = styled.div`
  font-weight: bold;
  margin-bottom: 12px;
  color: #4A90E2;
  font-size: 15px;
`;

export const FlowIndicator = styled.div<{ $from: DOMRect; $to: DOMRect }>`
  position: fixed;
  pointer-events: none;
  height: 0;
  transform-origin: 0 0;
  border-top: 2px dashed #FFC107;
  width: ${props => {
    const dx = props.$to.left - props.$from.left;
    const dy = props.$to.top - props.$from.top;
    return Math.sqrt(dx * dx + dy * dy) + 'px';
  }};
  left: ${props => props.$from.left + props.$from.width / 2}px;
  top: ${props => props.$from.top + props.$from.height / 2}px;
  transform: ${props => {
    const dx = props.$to.left - props.$from.left;
    const dy = props.$to.top - props.$from.top;
    const angle = Math.atan2(dy, dx);
    return `rotate(${angle}rad)`;
  }};

  &::after {
    content: '→';
    position: absolute;
    right: -12px;
    top: -10px;
    color: #FFC107;
    font-size: 20px;
  }
`;

export const FlowLabel = styled.div`
  position: fixed;
  background: rgba(255, 193, 7, 0.9);
  color: black;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  z-index: 10000;
  transform: translate(-50%, -50%);
`;
// ... остальные стили 