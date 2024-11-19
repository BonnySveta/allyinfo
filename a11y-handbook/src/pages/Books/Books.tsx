import { Resource } from '../../types/resource';

interface BooksProps {
  resources: Resource[];
}

export function Books({ resources }: BooksProps) {
  return (
    <div>
      <h1>Книги</h1>
      {resources.map((resource) => (
        <div key={resource.id}>
          <h2>{resource.preview.title}</h2>
          <p>{resource.preview.description}</p>
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            Подробнее
          </a>
        </div>
      ))}
    </div>
  );
} 