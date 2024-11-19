import { Resource } from '../../types/resource';

interface CoursesProps {
  resources: Resource[];
}

export function Courses({ resources }: CoursesProps) {
  return (
    <div>
      <h1>Курсы</h1>
      {resources.map((resource) => (
        <div key={resource.id}>
          <h2>{resource.preview.title}</h2>
          <p>{resource.preview.description}</p>
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            Перейти к курсу
          </a>
        </div>
      ))}
    </div>
  );
} 