import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Resource } from '../../types/resource';
import { fetchSuggestions, updateSuggestion, deleteSuggestion } from '../../services/supabase';
import { FilterChipsPanel } from '../FilterChips';

// interface AdminResource extends Resource {
//   status: string;
//   id: string | number;
// }
interface AdminResource {
  id: string | number;
  url: string;
  section: string;
  description: string | null;
  categories: any[];
  preview: {
    title: string;
    description: string;
    image: string;
    favicon: string;
    domain: string;
  };
  createdAt: string;
  status: string;
}

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
`;

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

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.25em 0.75em;
  border-radius: 8px;
  font-size: 0.9em;
  color: white;
  background: ${({ $status }) =>
    $status === 'approved' ? 'var(--success-color)' :
    $status === 'pending' ? 'var(--warning-color)' :
    'var(--error-color)'};
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  border: none;
  border-radius: 4px;
  background: var(--accent-color);
  color: white;
  cursor: pointer;
  font-size: 0.95em;
  &:hover {
    background: var(--primary-hover-color, #0052a3);
  }
`;

export default function MaterialsAdmin() {
  const [materials, setMaterials] = useState<AdminResource[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const all = await fetchSuggestions();
      setMaterials(all as AdminResource[]);
      setError('');
    } catch (e) {
      setError('Не удалось загрузить материалы');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id: string | number, status: string) => async () => {
    try {
      await updateSuggestion(String(id), { status });
      setMaterials(prev => prev.map(m => String(m.id) === String(id) ? { ...m, status } : m));
    } catch (e) {
      alert('Ошибка при обновлении статуса');
    }
  };

  const handleDelete = (id: string | number) => async () => {
    if (!window.confirm('Удалить материал?')) return;
    try {
      await deleteSuggestion(String(id));
      setMaterials(prev => prev.filter(m => String(m.id) !== String(id)));
    } catch (e) {
      alert('Ошибка при удалении');
    }
  };

  const filtered = materials.filter(m =>
    (statusFilter === 'all' || m.status === statusFilter) &&
    (search === '' || m.preview.title.toLowerCase().includes(search.toLowerCase()) || m.url.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Container>
      <h1>Материалы</h1>
      <FilterBar>
        <label>
          Статус:
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">Все</option>
            <option value="pending">На модерации</option>
            <option value="approved">Опубликованные</option>
            <option value="rejected">Отклонённые</option>
          </select>
        </label>
        <SearchInput
          type="text"
          placeholder="Поиск по названию или ссылке"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </FilterBar>
      {loading ? (
        <div>Загрузка...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Название</Th>
              <Th>Ссылка</Th>
              <Th>Статус</Th>
              <Th>Действия</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id}>
                <Td>{m.preview?.title || 'Без названия'}</Td>
                <Td><a href={m.url} target="_blank" rel="noopener noreferrer">{m.url}</a></Td>
                <Td><StatusBadge $status={m.status || 'pending'}>{m.status === 'approved' ? 'Опубликован' : m.status === 'pending' ? 'На модерации' : 'Отклонён'}</StatusBadge></Td>
                <Td>
                  {m.status !== 'approved' && (
                    <ActionButton onClick={handleStatusChange(m.id, 'approved')}>Опубликовать</ActionButton>
                  )}
                  {m.status !== 'rejected' && (
                    <ActionButton onClick={handleStatusChange(m.id, 'rejected')}>Отклонить</ActionButton>
                  )}
                  <ActionButton onClick={handleDelete(m.id)}>Удалить</ActionButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
} 