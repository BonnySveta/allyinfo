import { Resource } from '../../types/resource';

interface PodcastsProps {
  resources: Resource[];
}

export function Podcasts({ resources }: PodcastsProps) {
  return (
    <div>
      <h1>Подкасты</h1>
      {resources.map((resource) => (
        <div key={resource.id}>
          <h2>{resource.preview.title}</h2>
          <p>{resource.preview.description}</p>
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            Слушать
          </a>
        </div>
      ))}
    </div>
  );
}