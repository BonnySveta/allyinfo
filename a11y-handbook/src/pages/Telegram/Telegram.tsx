import { Resource } from '../../types/resource';

interface TelegramProps {
  resources: Resource[];
}

export function Telegram({ resources }: TelegramProps) {
  return (
    <div>
      <h1>Telegram</h1>
      {resources.map((resource) => (
        <div key={resource.id}>
          <h2>{resource.preview.title}</h2>
          <p>{resource.preview.description}</p>
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            Перейти в канал
          </a>
        </div>
      ))}
    </div>
  );
} 