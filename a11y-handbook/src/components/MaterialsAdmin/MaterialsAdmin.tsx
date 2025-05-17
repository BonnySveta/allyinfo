import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Resource } from '../../types/resource';
import { fetchSuggestions, updateSuggestion, deleteSuggestion, fetchCategories } from '../../services/supabase';
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
  const [editId, setEditId] = useState<string | number | null>(null);
  const [editFields, setEditFields] = useState<{
    title: string;
    url: string;
    description: string;
    section: string;
    preview_description: string;
    preview_image: string;
    preview_favicon: string;
    preview_domain: string;
    status: string;
  }>({
    title: '',
    url: '',
    description: '',
    section: '',
    preview_description: '',
    preview_image: '',
    preview_favicon: '',
    preview_domain: '',
    status: 'pending',
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    loadMaterials();
    async function loadCategories() {
      setCategoriesLoading(true);
      try {
        const cats = await fetchCategories();
        setCategories(cats);
      } catch (e) {
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    }
    loadCategories();
  }, [statusFilter]);

  const loadMaterials = async () => {
    setLoading(true);
    try {
      let all;
      if (statusFilter === 'all') {
        all = await fetchSuggestions();
      } else {
        all = await fetchSuggestions(statusFilter);
      }
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

  const handleEdit = (m: AdminResource) => {
    setEditId(m.id);
    setEditFields({
      title: m.preview?.title || '',
      url: m.url,
      description: m.description || '',
      section: m.section || '',
      preview_description: m.preview?.description || '',
      preview_image: m.preview?.image || '',
      preview_favicon: m.preview?.favicon || '',
      preview_domain: m.preview?.domain || '',
      status: m.status || 'pending',
    });
  };

  const handleEditFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSave = async (id: string | number) => {
    try {
      await updateSuggestion(String(id), {
        url: editFields.url,
        section: editFields.section,
        description: editFields.description,
        preview_title: editFields.title,
        preview_description: editFields.preview_description,
        preview_image: editFields.preview_image,
        preview_favicon: editFields.preview_favicon,
        preview_domain: editFields.preview_domain,
        status: editFields.status,
      });
      setMaterials(prev => prev.map(m => String(m.id) === String(id) ? {
        ...m,
        url: editFields.url,
        section: editFields.section,
        description: editFields.description,
        status: editFields.status,
        preview: {
          ...m.preview,
          title: editFields.title,
          description: editFields.preview_description,
          image: editFields.preview_image,
          favicon: editFields.preview_favicon,
          domain: editFields.preview_domain,
        }
      } : m));
      setEditId(null);
    } catch (e) {
      alert('Ошибка при сохранении изменений');
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
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
              <Th>Раздел</Th>
              <Th>Статус</Th>
              <Th>Действия</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id}>
                {editId === m.id ? null : (
                  <>
                    <Td>{m.preview?.title || 'Без названия'}</Td>
                    <Td><a href={m.url} target="_blank" rel="noopener noreferrer">{m.url}</a></Td>
                    <Td>{m.section}</Td>
                    <Td><StatusBadge $status={m.status || 'pending'}>{m.status === 'approved' ? 'Опубликован' : m.status === 'pending' ? 'На модерации' : 'Отклонён'}</StatusBadge></Td>
                    <Td>
                      <div style={{display:'flex', flexDirection:'column', gap:8}}>
                        <ActionButton onClick={() => handleEdit(m)}>Редактировать</ActionButton>
                        {m.status !== 'approved' && (
                          <ActionButton onClick={handleStatusChange(m.id, 'approved')}>Опубликовать</ActionButton>
                        )}
                        {m.status !== 'rejected' && (
                          <ActionButton onClick={handleStatusChange(m.id, 'rejected')}>Отклонить</ActionButton>
                        )}
                        <ActionButton onClick={handleDelete(m.id)}>Удалить</ActionButton>
                      </div>
                    </Td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {editId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.4)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
          onClick={handleEditCancel}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 32,
              minWidth: 400,
              maxWidth: '90vw',
              boxShadow: '0 4px 32px rgba(0,0,0,0.15)',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Редактирование материала"
          >
            <h2 style={{marginTop:0}}>Редактировать материал</h2>
            <div style={{display:'flex', flexDirection:'column', gap:16}}>
              <label>
                Название
                <input name="title" value={editFields.title} onChange={handleEditFieldChange} style={{width:'100%',marginTop:4}} />
              </label>
              <label>
                Ссылка
                <input name="url" value={editFields.url} onChange={handleEditFieldChange} style={{width:'100%',marginTop:4}} />
              </label>
              <label>
                Раздел
                <select
                  name="section"
                  value={editFields.section}
                  onChange={handleEditFieldChange}
                  style={{width:'100%',marginTop:4}}
                  required
                  disabled={categoriesLoading}
                >
                  <option value="">Выберите раздел</option>
                  {categories.map((cat:any) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </label>
              <label>
                Описание
                <textarea name="description" value={editFields.description} onChange={handleEditFieldChange} style={{width:'100%',marginTop:4}} rows={3} />
              </label>
              <label>
                Preview Title
                <input name="preview_title" value={editFields.title} onChange={handleEditFieldChange} style={{width:'100%',marginTop:4}} />
              </label>
              <label>
                Preview Desc
                <textarea name="preview_description" value={editFields.preview_description} onChange={handleEditFieldChange} style={{width:'100%',marginTop:4}} rows={2} />
              </label>
              <label>
                Preview Image
                <input name="preview_image" value={editFields.preview_image} onChange={handleEditFieldChange} style={{width:'100%',marginTop:4}} />
              </label>
              <label>
                Favicon
                <input name="preview_favicon" value={editFields.preview_favicon} onChange={handleEditFieldChange} style={{width:'100%',marginTop:4}} />
              </label>
              <label>
                Domain
                <input name="preview_domain" value={editFields.preview_domain} onChange={handleEditFieldChange} style={{width:'100%',marginTop:4}} />
              </label>
              <label>
                Статус
                <select name="status" value={editFields.status} onChange={handleEditFieldChange} style={{width:'100%',marginTop:4}}>
                  <option value="pending">На модерации</option>
                  <option value="approved">Опубликован</option>
                  <option value="rejected">Отклонён</option>
                </select>
              </label>
              <div style={{display:'flex',gap:12,marginTop:16,justifyContent:'flex-end'}}>
                <ActionButton onClick={() => handleEditSave(editId)}>Сохранить</ActionButton>
                <ActionButton className="secondary" onClick={handleEditCancel}>Отмена</ActionButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
} 