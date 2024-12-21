import styled from 'styled-components';
import { SpotlightPosition } from './types';

export const Spotlight = styled.div<{ $position: SpotlightPosition }>`
  position: fixed;
  top: ${props => props.$position.top}px;
  left: ${props => props.$position.left}px;
  width: ${props => props.$position.width}px;
  height: ${props => props.$position.height}px;
  background: transparent;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.9);
  z-index: 9999;
  pointer-events: none;
  border: 2px solid #4A90E2;
  border-radius: 4px;
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
`;

export const InfoText = styled.div`
  margin: 4px 0;
`;

export const ShortcutsList = styled.div`
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 12px;
`;

export const Shortcut = styled.span`
  display: inline-block;
  margin-right: 12px;
  color: rgba(255, 255, 255, 0.9);
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
// ... остальные стили 