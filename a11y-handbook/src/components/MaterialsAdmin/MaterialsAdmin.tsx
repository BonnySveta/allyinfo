import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Resource } from '../../types/resource';
import { fetchSuggestions as fetchResources, updateSuggestion, deleteSuggestion, fetchCategories, fetchSections, fetchResourceCategories } from '../../services/supabase';
import { FilterChipsPanel } from '../FilterChips';
import { supabase } from '../../services/supabase';
import { LinkPreview } from '../LinkPreview/LinkPreview';

// interface AdminResource extends Resource {
//   status: string;
//   id: string | number;
// }
interface AdminResource {
  id: string | number;
  url: string;
  section_id: string;
  category_id: string;
  description: string | null;
  categories: any[];
  title: string;
  image: string;
  favicon: string;
  domain: string;
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
    section_id: string;
    categories: string[];
    image: string;
    favicon: string;
    domain: string;
    status: string;
  }>({
    title: '',
    url: '',
    description: '',
    section_id: '',
    categories: [],
    image: '',
    favicon: '',
    domain: '',
    status: 'pending',
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [sections, setSections] = useState<any[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);

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
    async function loadSections() {
      setSectionsLoading(true);
      try {
        const secs = await fetchSections();
        setSections(secs);
      } catch (e) {
        setSections([]);
      } finally {
        setSectionsLoading(false);
      }
    }
    loadCategories();
    loadSections();
  }, [statusFilter]);

  const loadMaterials = async () => {
    setLoading(true);
    try {
      let all;
      if (statusFilter === 'all') {
        all = await fetchResources();
      } else {
        all = await fetchResources(statusFilter);
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

  const handleEdit = async (m: AdminResource) => {
    setEditId(m.id);
    let cats: string[] = [];
    try {
      cats = await fetchResourceCategories(m.id as string);
    } catch {}
    setEditFields({
      title: m.title || '',
      url: m.url,
      description: m.description || '',
      section_id: m.section_id || '',
      categories: cats,
      image: m.image || '',
      favicon: m.favicon || '',
      domain: m.domain || '',
      status: m.status || 'pending',
    });
  };

  const handleEditFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditSave = async (id: string | number) => {
    try {
      const payload = {
        url: editFields.url,
        section_id: editFields.section_id,
        description: editFields.description,
        title: editFields.title,
        image: editFields.image,
        favicon: editFields.favicon,
        domain: editFields.domain,
        status: editFields.status,
      };
      console.log('PATCH payload:', payload);
      await updateSuggestion(String(id), payload);
      // Обновляем связи категорий
      // 1. Удаляем старые
      await supabase.from('resource_categories').delete().eq('resource_id', id);
      // 2. Добавляем новые
      if (editFields.categories.length > 0) {
        const inserts = editFields.categories.map(category_id => ({ resource_id: id, category_id }));
        await supabase.from('resource_categories').insert(inserts);
      }
      setMaterials(prev => prev.map(m => String(m.id) === String(id) ? {
        ...m,
        url: editFields.url,
        section_id: editFields.section_id,
        description: editFields.description,
        title: editFields.title,
        image: editFields.image,
        favicon: editFields.favicon,
        domain: editFields.domain,
        status: editFields.status,
        categories: editFields.categories,
      } : m));
      setEditId(null);
    } catch (e) {
      alert('Ошибка при сохранении изменений');
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
  };

  const handlePreviewLoad = (data: any) => {
    setEditFields(prev => ({
      ...prev,
      title: data.title || prev.title,
      description: data.description || prev.description,
      image: data.image || prev.image,
      favicon: data.favicon || prev.favicon,
      domain: data.domain || prev.domain,
    }));
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
                    <Td>{m.title || 'Без названия'}</Td>
                    <Td><a href={m.url} target="_blank" rel="noopener noreferrer">{m.url}</a></Td>
                    <Td>{sections.find(sec => sec.id === m.section_id)?.label || '—'}</Td>
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
              maxHeight: '90vh',
              overflowY: 'auto',
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
              {editFields.url && (
                <div style={{margin: '12px 0'}}>
                  <LinkPreview url={editFields.url} onLoad={handlePreviewLoad} />
                </div>
              )}
              <label>
                Раздел
                <select
                  name="section_id"
                  value={editFields.section_id}
                  onChange={handleEditFieldChange}
                  style={{width:'100%',marginTop:4}}
                  required
                  disabled={sectionsLoading}
                >
                  <option value="">Выберите раздел</option>
                  {sections.map((sec:any) => (
                    <option key={sec.id} value={sec.id}>{sec.label}</option>
                  ))}
                </select>
              </label>
              <label>
                Описание
                <textarea name="description" value={editFields.description} onChange={handleEditFieldChange} style={{width:'100%',marginTop:4}} rows={3} />
              </label>
              <label>
                Картинка (image)
                <input name="image" value={editFields.image || ''} onChange={handleEditFieldChange} style={{width:'100%',marginTop:4}} />
              </label>
              <label>
                Favicon
                <input name="favicon" value={editFields.favicon || ''} onChange={handleEditFieldChange} style={{width:'100%',marginTop:4}} />
              </label>
              <label>
                Domain
                <input name="domain" value={editFields.domain || ''} onChange={handleEditFieldChange} style={{width:'100%',marginTop:4}} />
              </label>
              <label>
                Категории
                <FilterChipsPanel
                  categories={categories}
                  selectedCategories={editFields.categories as any}
                  onChange={(newCategories) => setEditFields(prev => ({ ...prev, categories: newCategories }))}
                  showCount={false}
                />
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