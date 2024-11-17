import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LinkPreview } from '../LinkPreview/LinkPreview';
import { Toast } from '../Toast/Toast';

interface Suggestion {
  id: number;
  url: string;
  section: string;
  description: string | null;
  preview: {
    title: string;
    description: string;
    image: string | null;
    favicon: string;
    domain: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const SuggestionCard = styled.div`
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: var(--background-color);
`;

const SectionTag = styled.span`
  background: var(--tag-background);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  margin-right: 0.5rem;
`;

const StatusTag = styled.span<{ $status: string }>`
  background: ${props => 
    props.$status === 'approved' ? 'var(--success-color)' : 
    props.$status === 'rejected' ? 'var(--error-color)' : 
    'var(--warning-color)'};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
`;

const Description = styled.p`
  margin: 1rem 0;
  color: var(--text-secondary);
`;

const DateText = styled.div`
  color: var(--text-tertiary);
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Button = styled.button<{ $variant?: 'success' | 'danger' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  background: ${props => 
    props.$variant === 'success' ? 'var(--success-color)' : 
    props.$variant === 'danger' ? 'var(--error-color)' : 
    'var(--accent-color)'};
  color: white;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
`;

const ErrorText = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--error-color);
`;

export function SuggestionsList() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/suggestions/all');
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      setError('Не удалось загрузить предложения');
      console.error('Error fetching suggestions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`http://localhost:3001/api/suggestions/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedSuggestion = await response.json();

      setSuggestions(prev =>
        prev.map(suggestion =>
          suggestion.id === id ? { ...suggestion, status } : suggestion
        )
      );

      setToast({
        show: true,
        message: status === 'approved' 
          ? 'Материал успешно одобрен!' 
          : 'Материал отклонен',
        type: 'success'
      });

    } catch (err) {
      console.error('Error updating status:', err);
      setToast({
        show: true,
        message: 'Не удалось обновить статус материала',
        type: 'error'
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <LoadingText>Загрузка предложений...</LoadingText>;
  if (error) return <ErrorText>{error}</ErrorText>;

  return (
    <Container>
      <h1>Предложенные материалы</h1>
      {suggestions.map(suggestion => (
        <SuggestionCard key={suggestion.id}>
          <div>
            <SectionTag>{suggestion.section}</SectionTag>
            <StatusTag $status={suggestion.status}>
              {suggestion.status === 'pending' ? 'На модерации' :
               suggestion.status === 'approved' ? 'Одобрено' : 
               'Отклонено'}
            </StatusTag>
          </div>

          <LinkPreview url={suggestion.url} />

          {suggestion.description && (
            <Description>{suggestion.description}</Description>
          )}

          {suggestion.status === 'pending' && (
            <ButtonGroup>
              <Button
                $variant="success"
                onClick={() => handleUpdateStatus(suggestion.id, 'approved')}
              >
                Одобрить
              </Button>
              <Button
                $variant="danger"
                onClick={() => handleUpdateStatus(suggestion.id, 'rejected')}
              >
                Отклонить
              </Button>
            </ButtonGroup>
          )}

          <DateText>
            Предложено: {formatDate(suggestion.createdAt)}
          </DateText>
        </SuggestionCard>
      ))}

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      )}
    </Container>
  );
} 