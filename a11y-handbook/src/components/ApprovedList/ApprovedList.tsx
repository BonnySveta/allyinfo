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

const ActionButton = styled.button`
  padding: 0.5rem;
  margin: 0 0.25rem;
  border: none;
  background: none;
  color: var(--accent-color);
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

export function ApprovedList() {
  const [items, setItems] = useState<ApprovedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<ApprovedItem>>({});

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

  const handleEdit = (item: ApprovedItem) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleSave = async () => {
    try {
      if (!editingId || !editForm.section || !editForm.preview?.title || !editForm.preview?.domain) {
        throw new Error('Необходимые поля не заполнены');
      }

      const updateData = {
        section: editForm.section,
        description: editForm.description ?? null,
        preview: {
          title: editForm.preview.title,
          domain: editForm.preview.domain
        }
      };

      console.log('Sending PUT request to:', `http://localhost:3001/api/suggestions/${editingId}`);
      console.log('Update data:', updateData);

      const response = await fetch(`http://localhost:3001/api/suggestions/${editingId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        let errorMessage;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || 'Failed to update item';
        } else {
          errorMessage = await response.text();
        }
        
        throw new Error(errorMessage);
      }
      
      const updatedItems = items.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            section: updateData.section,
            description: updateData.description,
            preview: updateData.preview
          } as ApprovedItem;
        }
        return item;
      });
      
      setItems(updatedItems);
      setEditingId(null);
      setEditForm({});
    } catch (err) {
      console.error('Save error:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при обновлении записи');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту запись?')) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/suggestions/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete item');
      
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      setError('Ошибка при удалении записи');
    }
  };

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
            <Th>Действия</Th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <Td>{item.id}</Td>
              <Td>
                {editingId === item.id ? (
                  <input
                    value={editForm.section || ''}
                    onChange={e => setEditForm({ ...editForm, section: e.target.value })}
                  />
                ) : (
                  item.section
                )}
              </Td>
              <Td>
                {editingId === item.id ? (
                  <input
                    value={editForm.preview?.title || ''}
                    onChange={e => setEditForm({
                      ...editForm,
                      preview: {
                        ...editForm.preview,
                        title: e.target.value,
                        domain: editForm.preview?.domain || ''
                      }
                    })}
                  />
                ) : (
                  <Link href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.preview.title}
                  </Link>
                )}
              </Td>
              <Td>{item.preview.domain}</Td>
              <Td>
                {editingId === item.id ? (
                  <input
                    value={editForm.description || ''}
                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  />
                ) : (
                  item.description || '—'
                )}
              </Td>
              <Td>{new Date(item.createdAt).toLocaleDateString('ru-RU')}</Td>
              <Td>
                {editingId === item.id ? (
                  <>
                    <ActionButton onClick={handleSave}>Сохранить</ActionButton>
                    <ActionButton onClick={() => setEditingId(null)}>Отмена</ActionButton>
                  </>
                ) : (
                  <>
                    <ActionButton onClick={() => handleEdit(item)}>Редактировать</ActionButton>
                    <ActionButton onClick={() => handleDelete(item.id)}>Удалить</ActionButton>
                  </>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
} 