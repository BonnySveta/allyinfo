import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import styled from 'styled-components';
import { Toast } from '../Toast/Toast';
import { LinkPreview } from '../LinkPreview/LinkPreview';
import { PreviewData } from '../../types/preview';
import {
  FormContainer,
  StyledForm,
  FormGroup,
  Label,
  Select,
  Input,
  TextArea,
  SubmitButton,
  ErrorMessage,
  RequiredMark,
  HintText,
  LabelText,
  RequiredFieldsHint,
  LoadingSpinner
} from '../Form/FormComponents';
import { addSuggestion, fetchCategories, addResourceCategory } from '../../services/supabase';
import { FilterChipsPanel } from '../FilterChips/FilterChipsPanel';
import { CategoryId } from '../../types/category';

interface FormData {
  section: string;
  url: string;
  description: string;
}

const DRAFT_KEY = 'suggest-form-draft';

interface SuggestFormProps {
  getPreview?: (url: string, section: string) => Promise<PreviewData>;
}

export function SuggestForm({ getPreview }: SuggestFormProps) {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [urlError, setUrlError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [previewDescription, setPreviewDescription] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([]);

  useEffect(() => {
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
  }, []);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('URL changed:', value);
    setUrl(value);
    setPreviewDescription(null);
    setIsPreviewLoading(true);
  };

  const handlePreviewLoad = (data: PreviewData) => {
    setIsPreviewLoading(false);
    setPreviewData(data);
    if (data.description) {
      setPreviewDescription(data.description);
      setDescription(data.description);
    } else {
      setPreviewDescription(null);
    }
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (isPreviewLoading) {
      setError('Дождитесь загрузки предпросмотра');
      return;
    }
    if (!url) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    if (!validateUrl(url)) {
      return;
    }
    if (selectedCategories.length === 0) {
      setError('Пожалуйста, выберите хотя бы одну категорию');
      return;
    }
    setIsLoading(true);
    try {
      // Подробные логи для дебага
      console.log('=== DEBUG SUBMIT ===');
      console.log('previewData перед отправкой:', previewData);
      console.log('description:', description);
      const submitObj = {
        url,
        title: previewData?.title || '',
        description: previewData?.description || description || null,
        image: previewData?.image || '',
        favicon: previewData?.favicon || '',
        domain: previewData?.domain || '',
        status: 'pending'
      };
      console.log('Отправляемый объект:', submitObj);
      // Сохраняем материал
      const resource = await addSuggestion(submitObj);
      // Сохраняем связи с категориями
      if (resource && resource.id) {
        for (const category_id of selectedCategories) {
          await addResourceCategory(resource.id, category_id);
        }
      }
      clearDraft();
      setUrl('');
      setDescription('');
      setPreviewData(null);
      setSelectedCategories([]);
      setToast({
        show: true,
        message: 'Материал успешно предложен!',
        type: 'success'
      });
    } catch (err) {
      console.error('Error submitting suggestion:', err);
      setToast({
        show: true,
        message: 'Произошла ошибка при отправке формы',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateUrl = (value: string) => {
    try {
      new URL(value);
      setUrlError('');
      return true;
    } catch {
      setUrlError('Пожалуйста, введите корректный URL');
      return false;
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
  };

  // ... все useEffect и функции-обработчики остаются здесь ...

  // Дебаг: выводим категории перед рендером селекта
  console.log('CATEGORIES FOR SELECT:', categories, 'LOADING:', categoriesLoading);

  return (
    <FormContainer>      
      <StyledForm onSubmit={handleSubmit} noValidate>
        <FormGroup>
          <Label>
            <LabelText>
              Категория
              <RequiredMark>*</RequiredMark>
            </LabelText>
          </Label>
          <FilterChipsPanel
            categories={categories}
            selectedCategories={selectedCategories}
            onChange={setSelectedCategories}
            showCount={false}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="url">
            <LabelText>
              Ссылка на материал
              <RequiredMark>*</RequiredMark>
            </LabelText>
          </Label>
          <Input
            type="url"
            id="url"
            value={url}
            onChange={handleUrlChange}
            placeholder="https://example.com"
            required
            aria-invalid={Boolean(urlError)}
          />
          {url && !urlError && (
            <LinkPreview 
              url={url} 
              onLoad={handlePreviewLoad}
              getPreview={getPreview}
              section={''}
            />
          )}
          {urlError && (
            <ErrorMessage role="alert" aria-live="polite">
              {urlError}
            </ErrorMessage>
          )}
        </FormGroup>

        {error && (
          <ErrorMessage role="alert" aria-live="polite">
            {error}
          </ErrorMessage>
        )}

        <SubmitButton type="submit" disabled={isLoading || isPreviewLoading}>
          {isLoading ? (
            <>
              Отправка
              <LoadingSpinner />
            </>
          ) : (
            'Отправить'
          )}
        </SubmitButton>
      </StyledForm>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      )}
    </FormContainer>
  );
}

export default SuggestForm;