import styled from 'styled-components';
import { SpotlightPosition } from './types';

export const Overlay = styled.div<{ $isActive: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: ${props => props.$isActive ? 'auto' : 'none'};
  z-index: 9999;
`;

export const Spotlight = styled.div<{ $position: SpotlightPosition }>`
  position: absolute;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.85);
  border-radius: 4px;
  transition: all 0.3s ease;
  pointer-events: none;
  background: transparent;
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
  ${({ $position }) => `
    top: ${$position.top}px;
    left: ${$position.left}px;
    width: ${$position.width}px;
    height: ${$position.height}px;
  `}
`;

export const ElementInfo = styled.div<{ $position: SpotlightPosition }>`
  position: fixed;
  top: ${props => props.$position.top + props.$position.height + 8}px;
  left: ${props => props.$position.left}px;
  background: var(--accent-color);
  color: white;
  padding: 12px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.4;
  min-width: 280px;
  max-width: 400px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
`;

export const Role = styled.span`
  font-weight: bold;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const HeadingLevel = styled.span`
  background: rgba(var(--accent-color-rgb), 0.4);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  margin-left: 6px;
  font-weight: bold;
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
  color: var(--accent-color);
  font-size: 15px;
`;

export const Shortcut = styled.span`
  background: rgba(255, 255, 255, 0.15);
  padding: 4px 8px;
  border-radius: 3px;
  margin: 0 8px 8px 0;
  font-family: monospace;
  display: inline-block;
  white-space: nowrap;
`;

export const State = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 3px;
  font-size: 12px;
  display: inline-block;
  margin: 2px 4px;
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
  color: var(--accent-color);
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
  color: var(--accent-color);
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const Attributes = styled.span`
  opacity: 0.9;
  display: block;
  margin-top: 4px;
`;

export const Position = styled(State)`
  background: rgba(255, 255, 255, 0.3);
`;

export const LandmarkInfo = styled.span`
  background: rgba(var(--accent-color-rgb), 0.3);
  font-style: italic;
`;

export const AriaAttribute = styled.span`
  background: rgba(255, 255, 255, 0.25);
  font-family: monospace;
`;

export const ListInfo = styled.span`
  background: rgba(0, 120, 215, 0.3);
  font-weight: 500;
`;

export const ShortcutInfo = styled.div`
  margin-top: 8px;
  font-size: 12px;
  opacity: 0.9;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;
// ... остальные стили 