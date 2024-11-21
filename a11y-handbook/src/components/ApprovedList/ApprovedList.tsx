import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Resource } from '../../types/resource';

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

const FiltersContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 16px;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Pagination = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 8px;
  justify-content: center;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: ${props => props.$active ? '#007bff' : 'white'};
  color: ${props => props.$active ? 'white' : 'black'};
  cursor: pointer;

  &:hover {
    background: ${props => props.$active ? '#007bff' : '#f0f0f0'};
  }
`;

export function ApprovedList() {
  const [items, setItems] = useState<Resource[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [section, setSection] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Resource>>({});

  useEffect(() => {
    const loadSections = async () => {
      try {
        console.log('Loading sections...');
        const response = await fetch('http://localhost:3001/api/sections');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Loaded sections:', data);
        setSections(data);
      } catch (error) {
        console.error('Error loading sections:', error);
        setError('Ошибка при загрузке разделов');
      }
    };
    
    loadSections();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (search) params.append('search', search);
      if (section) params.append('section', section);
      params.append('sortBy', sortBy);
      params.append('order', order);
      params.append('page', String(page));
      params.append('limit', String(limit));

      const response = await fetch(`http://localhost:3001/api/suggestions?${params}`);
      const data = await response.json();

      const transformedItems = data.items.map((item: any) => ({
        id: item.id,
        url: item.url,
        section: item.section,
        description: item.description,
        preview: {
          title: item.preview_title,
          description: item.preview_description,
          image: item.preview_image,
          favicon: item.preview_favicon,
          domain: item.preview_domain
        },
        status: item.status,
        createdAt: item.created_at
      }));

      setItems(transformedItems);
      setTotal(data.pagination.total);
    } catch (error) {
      console.error('Error loading items:', error);
      setError('Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [search, section, sortBy, order, page]);

  const handleEdit = (item: Resource) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleSave = async () => {
    try {
      if (!editingId || !editForm.section || !editForm.preview?.title) {
        throw new Error('Необходимые поля не заполнены');
      }

      const updateData = {
        section: editForm.section,
        description: editForm.description ?? null,
        preview: {
          title: editForm.preview.title,
          description: editForm.preview.description,
          image: editForm.preview.image,
          favicon: editForm.preview.favicon,
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
          } as Resource;
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

  return (
    <div>
      <h1>Одобренные материалы</h1>
      
      <FiltersContainer>
        <SearchInput
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={section} onChange={(e) => setSection(e.target.value)}>
          <option value="">Все разделы</option>
          {sections.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>

        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">По дате</option>
          <option value="title">По названию</option>
          <option value="section">По разделу</option>
        </Select>

        <Select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="desc">По убыванию</option>
          <option value="asc">По возрастанию</option>
        </Select>
      </FiltersContainer>

      {loading ? (
        <div>Загрузка...</div>
      ) : error ? (
        <div>{error}</div>
      ) : items.length === 0 ? (
        <div>Нет данных для отображения</div>
      ) : (
        <>
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
                  <Td>{item.section}</Td>
                  <Td>
                    <Link href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.preview.title}
                    </Link>
                  </Td>
                  <Td>{item.preview.domain}</Td>
                  <Td>{item.description || '—'}</Td>
                  <Td>{new Date(item.createdAt).toLocaleDateString('ru-RU')}</Td>
                  <Td>
                    <ActionButton onClick={() => handleEdit(item)}>Редактировать</ActionButton>
                    <ActionButton onClick={() => handleDelete(item.id)}>Удалить</ActionButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination>
            {Array.from({ length: Math.ceil(total / limit) }).map((_, i) => (
              <PageButton
                key={i + 1}
                $active={page === i + 1}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </PageButton>
            ))}
          </Pagination>
        </>
      )}
    </div>
  );
} 