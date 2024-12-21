import { ElementDetails, SpotlightPosition } from '../types';
import { InfoPanel, InfoText, ShortcutsList, Shortcut } from '../styles';

interface ElementInfoDisplayProps {
  elementInfo: ElementDetails;
  position: SpotlightPosition;
}

export function ElementInfoDisplay({ elementInfo, position }: ElementInfoDisplayProps) {
  return (
    <InfoPanel $position={position}>
      <InfoText>
        {elementInfo.role}
        {elementInfo.level ? ` ${elementInfo.level}` : ''}
        {elementInfo.label ? `: ${elementInfo.label}` : ''}
      </InfoText>
      
      {elementInfo.states.length > 0 && (
        <InfoText>
          {elementInfo.states.join(', ')}
        </InfoText>
      )}
      
      {elementInfo.description && (
        <InfoText>{elementInfo.description}</InfoText>
      )}

      {elementInfo.shortcuts && elementInfo.shortcuts.length > 0 && (
        <ShortcutsList>
          {elementInfo.shortcuts.map((shortcut, index) => (
            <Shortcut key={index}>{shortcut}</Shortcut>
          ))}
        </ShortcutsList>
      )}
    </InfoPanel>
  );
} 