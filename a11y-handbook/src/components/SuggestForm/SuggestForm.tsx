import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import styled from 'styled-components';
import { navigationConfig } from '../../config/navigation';
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
import { addSuggestion } from '../../services/supabase';

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
  const [section, setSection] = useState('');
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

  const sections = navigationConfig;

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('URL changed:', value);
    setUrl(value);
    setPreviewDescription(null);
    setIsPreviewLoading(true);
  };

  const handlePreviewLoad = (data: PreviewData) => {
    console.log('Preview loaded:', data);
    setIsPreviewLoading(false);
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
    
    if (!section || !url) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (!validateUrl(url)) {
      return;
    }

    setIsLoading(true);

    try {
      await addSuggestion({
        url,
        section,
        description: previewData?.description || description || null,
        preview_title: previewData?.title || '',
        preview_description: previewData?.description || '',
        preview_image: previewData?.image || '',
        preview_favicon: previewData?.favicon || '',
        preview_domain: previewData?.domain || '',
        status: 'pending'
      });

      clearDraft();
      setSection('');
      setUrl('');
      setDescription('');
      setPreviewData(null);
      
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

  return (
    <FormContainer>      
      <StyledForm onSubmit={handleSubmit} noValidate>
        <FormGroup>
          <Label htmlFor="section">
            <LabelText>
              Раздел
              <RequiredMark>*</RequiredMark>
            </LabelText>
          </Label>
          <Select
            id="section"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            required
            aria-invalid={error && !section ? "true" : "false"}
          >
            <option value="">Выберите раздел</option>
            {sections.map((item) => (
              <option key={item.path} value={item.path}>
                {item.title}
              </option>
            ))}
          </Select>
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
              section={section}
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

        <SubmitButton type="submit" disabled={isLoading}>
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