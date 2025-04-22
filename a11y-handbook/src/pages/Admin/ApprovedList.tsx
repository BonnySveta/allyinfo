import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Resource } from '../../types/resource';
import { CategoryId, CATEGORIES } from '../../types/category';
import { FilterChipsPanel } from '../../components/FilterChips';

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

const EditForm = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--nav-background);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 500px;
  z-index: 1000;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  min-height: 100px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &.primary {
    background: var(--accent-color);
    color: white;
  }
  
  &.secondary {
    background: var(--background-secondary);
    color: var(--text-color);
  }
`;

interface EditFormData {
  section?: string;
  description?: string | null;
  categories?: CategoryId[];
  preview?: {
    title: string;
    description?: string;
    image?: string | null;
    favicon?: string;
    domain?: string;
  };
}

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
  const [editForm, setEditForm] = useState<EditFormData>({});
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const loadSections = async () => {
      try {
        console.log('Loading sections...');
        const response = await fetch(`${apiUrl}/api/sections`);
        
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
      params.append('status', 'approved');

      const response = await fetch(`${apiUrl}/api/approved?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!data || !data.items || !data.pagination) {
        throw new Error('Invalid response format');
      }

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
        createdAt: item.created_at,
        categories: item.categories
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
        categories: editForm.categories || [],
        preview: {
          title: editForm.preview.title,
          description: editForm.preview.description || '',
          image: editForm.preview.image || null,
          favicon: editForm.preview.favicon || '',
          domain: editForm.preview.domain || ''
        }
      };

      console.log('Sending PUT request to:', `${apiUrl}/api/approved/${editingId}`);
      console.log('Update data:', updateData);

      const response = await fetch(`${apiUrl}/api/approved/${editingId}`, {
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
            categories: updateData.categories,
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
      const response = await fetch(`${apiUrl}/api/approved/${id}`, {
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
                <Th>Категории</Th>
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
                  <Td>
                    {item.categories?.map(catId => 
                      CATEGORIES.find(c => c.id === catId)?.label
                    ).join(', ') || '—'}
                  </Td>
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

          {editingId && (
            <>
              <Overlay onClick={() => setEditingId(null)} />
              <EditForm>
                <h2>Редактирование материала</h2>
                
                <FormGroup>
                  <Label>Раздел</Label>
                  <Select
                    value={editForm.section || ''}
                    onChange={(e) => setEditForm({ ...editForm, section: e.target.value })}
                  >
                    {sections.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Название</Label>
                  <Input
                    value={editForm.preview?.title || ''}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      preview: {
                        ...editForm.preview,
                        title: e.target.value,
                        description: editForm.preview?.description || '',
                        image: editForm.preview?.image || null,
                        favicon: editForm.preview?.favicon || '',
                        domain: editForm.preview?.domain || ''
                      }
                    })}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Описание</Label>
                  <TextArea
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Категории</Label>
                  <FilterChipsPanel
                    selectedCategories={editForm.categories || []}
                    onChange={(categories: CategoryId[]) => setEditForm({ ...editForm, categories })}
                  />
                </FormGroup>

                <ButtonGroup>
                  <Button className="secondary" onClick={() => setEditingId(null)}>
                    Отмена
                  </Button>
                  <Button className="primary" onClick={handleSave}>
                    Сохранить
                  </Button>
                </ButtonGroup>
              </EditForm>
            </>
          )}
        </>
      )}
    </div>
  );
} 