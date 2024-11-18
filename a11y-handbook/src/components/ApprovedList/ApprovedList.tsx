import { useState, useEffect } from 'react';
import styled from 'styled-components';

interface ApprovedItem {
  id: number;
  url: string;
  section: string;
  description: string | null;
  preview: {
    title: string;
    domain: string;
  };
  createdAt: string;
}

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background: var(--background-secondary);
  border-bottom: 2px solid var(--border-color);
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
`;

const Link = styled.a`
  color: var(--accent-color);
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export function ApprovedList() {
  const [items, setItems] = useState<ApprovedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/suggestions');
        if (!response.ok) throw new Error('Failed to fetch approved items');
        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError('Не удалось загрузить данные');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApproved();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Одобренные материалы</h1>
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Раздел</Th>
            <Th>Название</Th>
            <Th>Домен</Th>
            <Th>Описание</Th>
            <Th>Дата добавления</Th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <Td>{item.id}</Td>
              <Td>{item.section}</Td>
              <Td>
                <Link href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.preview.title}
                </Link>
              </Td>
              <Td>{item.preview.domain}</Td>
              <Td>{item.description || '—'}</Td>
              <Td>{new Date(item.createdAt).toLocaleDateString('ru-RU')}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
} 