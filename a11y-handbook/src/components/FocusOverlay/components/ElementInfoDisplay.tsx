import { ElementDetails, SpotlightPosition } from '../types';
import { 
  ElementInfo, 
  Role, 
  HeadingLevel, 
  State, 
  Attributes,
  Position,
  LandmarkInfo,
  AriaAttribute,
  ListInfo,
  ShortcutInfo,
  Shortcut
} from '../styles';

interface ElementInfoDisplayProps {
  elementInfo: ElementDetails;
  position: SpotlightPosition;
}

export function ElementInfoDisplay({ elementInfo, position }: ElementInfoDisplayProps) {
  return (
    <ElementInfo $position={position}>
      <Role>
        {elementInfo.role}
        {elementInfo.level && <HeadingLevel>H{elementInfo.level}</HeadingLevel>}
      </Role>

      {elementInfo.label && (
        <Attributes>
          {elementInfo.label}
          {elementInfo.description && ` (${elementInfo.description})`}
        </Attributes>
      )}

      {elementInfo.states?.length > 0 && elementInfo.states.map((state, index) => {
        if (state.includes(' of ')) {
          return <Position key={index}>{state}</Position>;
        }
        if (state.startsWith('landmark:') || state.startsWith('region:') || state.startsWith('in ')) {
          return <LandmarkInfo key={index}>{state}</LandmarkInfo>;
        }
        if (state.startsWith('heading level ')) {
          return <HeadingLevel key={index}>{state}</HeadingLevel>;
        }
        if (state.startsWith('aria-')) {
          return <AriaAttribute key={index}>{state}</AriaAttribute>;
        }
        if (state.includes('list with') || state.includes('item ')) {
          return <ListInfo key={index}>{state}</ListInfo>;
        }
        return <State key={index}>{state}</State>;
      })}

      {elementInfo.isInteractive && elementInfo.shortcuts && (
        <ShortcutInfo>
          {elementInfo.shortcuts.map((shortcut, index) => (
            <Shortcut key={index}>{shortcut}</Shortcut>
          ))}
        </ShortcutInfo>
      )}
    </ElementInfo>
  );
} 