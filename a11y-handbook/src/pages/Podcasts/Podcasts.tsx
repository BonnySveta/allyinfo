import { useState, useEffect } from 'react';
import styled from 'styled-components';

interface Resource {
  id: number;
  url: string;
  section: string;
  preview: {
    title: string;
    description: string;
  };
}

const Container = styled.div`
  padding: 2rem;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  margin-bottom: 2rem;
`;

const Link = styled.a`
  color: var(--accent-color);
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Description = styled.p`
  color: var(--text-secondary);
  margin-top: 0.5rem;
`;

export function Podcasts() {
  const [podcasts, setPodcasts] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/suggestions');
        if (!response.ok) throw new Error('Failed to fetch podcasts');
        const data = await response.json();
        const podcastsData = data.filter((item: Resource) => item.section === 'podcasts');
        setPodcasts(podcastsData);
      } catch (err) {
        setError('Не удалось загрузить подкасты');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container>
      <h1>Подкасты</h1>
      <p>Подкасты на тему цифровой доступности</p>
      {podcasts.length > 0 ? (
        <List>
          {podcasts.map(podcast => (
            <ListItem key={podcast.id}>
              <Link href={podcast.url} target="_blank" rel="noopener noreferrer">
                {podcast.preview.title}
              </Link>
              <Description>{podcast.preview.description}</Description>
            </ListItem>
          ))}
        </List>
      ) : (
        <p>Пока нет подкастов</p>
      )}
    </Container>
  );
}