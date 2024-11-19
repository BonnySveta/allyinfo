import { Resource } from '../../types/resource';

interface EventsProps {
  resources: Resource[];
}

export function Events({ resources }: EventsProps) {
  return (
    <div>
      <h1>События</h1>
      {resources.map((resource) => (
        <div key={resource.id}>
          <h2>{resource.preview.title}</h2>
          <p>{resource.preview.description}</p>
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            Подробнее о событии
          </a>
        </div>
      ))}
    </div>
  );
} 