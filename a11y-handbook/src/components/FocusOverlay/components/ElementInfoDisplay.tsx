import { ElementDetails, SpotlightPosition } from '../types';
import { InfoPanel, ShortcutsList, Shortcut } from '../styles';

interface ElementInfoDisplayProps {
  elementInfo: ElementDetails;
  position: SpotlightPosition;
}

export function ElementInfoDisplay({ elementInfo, position }: ElementInfoDisplayProps) {
  const [screenReaderText, technicalInfo] = elementInfo.screenReaderText?.split('\n') || [];
  const shortcuts = elementInfo.shortcuts || [];

  return (
    <InfoPanel $position={position}>
      <div className="screen-reader-text">
        {screenReaderText}
      </div>
      <div className="technical-info">
        {technicalInfo}
      </div>
      
      {shortcuts.length > 0 && (
        <ShortcutsList>
          {shortcuts.map((shortcut, index) => (
            <Shortcut key={index}>{shortcut}</Shortcut>
          ))}
        </ShortcutsList>
      )}
    </InfoPanel>
  );
} 