import { Resource } from '../../types/resource';

interface YouTubeProps {
  resources: Resource[];
}

export function YouTube({ resources }: YouTubeProps) {
  return (
    <div>
      <h1>YouTube</h1>
      {resources.map((resource) => (
        <div key={resource.id}>
          <h2>{resource.preview.title}</h2>
          <p>{resource.preview.description}</p>
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            Смотреть
          </a>
        </div>
      ))}
    </div>
  );
} 