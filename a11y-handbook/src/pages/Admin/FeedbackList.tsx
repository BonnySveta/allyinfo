import { useState, useEffect } from 'react';
import styled from 'styled-components';

interface FeedbackItem {
  id: number;
  message: string;
  status: string;
  created_at: string;
}

const Container = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  color: var(--text-color);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background: var(--background-secondary);
  color: var(--text-color);
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color);
`;

const Status = styled.span<{ status: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  background: ${({ status }) => 
    status === 'new' ? 'var(--color-warning-bg)' : 
    status === 'processed' ? 'var(--color-success-bg)' : 
    'var(--background-secondary)'};
  color: ${({ status }) => 
    status === 'new' ? 'var(--color-warning-text)' : 
    status === 'processed' ? 'var(--color-success-text)' : 
    'var(--text-color)'};
`;

export function AdminFeedbackList() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL; 

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/feedback`);
        if (!response.ok) throw new Error('Failed to fetch feedback');
        const data = await response.json();
        setFeedback(data);
      } catch (err) {
        setError('Не удалось загрузить сообщения обратной связи');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  if (loading) return <Container>Загрузка...</Container>;
  if (error) return <Container>{error}</Container>;

  return (
    <Container>
      <Title>Обратная связь</Title>
      <Table>
        <thead>
          <tr>
            <Th>Дата</Th>
            <Th>Сообщение</Th>
            <Th>Статус</Th>
          </tr>
        </thead>
        <tbody>
          {feedback.map(item => (
            <tr key={item.id}>
              <Td>{new Date(item.created_at).toLocaleString('ru')}</Td>
              <Td>{item.message}</Td>
              <Td>
                <Status status={item.status}>
                  {item.status === 'new' ? 'Новое' : 'Обработано'}
                </Status>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}