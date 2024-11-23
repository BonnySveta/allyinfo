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

interface FormData {
  section: string;
  url: string;
  description: string;
}

const DRAFT_KEY = 'suggest-form-draft';

export function SuggestForm() {
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
    setUrl(value);
    setPreviewDescription(null);
    setIsPreviewLoading(true);
  };

  const handlePreviewLoad = (data: PreviewData) => {
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
      const response = await fetch('http://localhost:3001/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          section,
          description: previewData?.description || description || null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit suggestion');
      }

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
              <RequiredMark aria-label="обязательное поле">*</RequiredMark>
            </LabelText>
          </Label>
          <Select
            id="section"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            required
            aria-required="true"
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
              <RequiredMark aria-label="обязательное поле">*</RequiredMark>
            </LabelText>
          </Label>
          <Input
            type="url"
            id="url"
            value={url}
            onChange={handleUrlChange}
            placeholder="https://example.com"
            required
            aria-required="true"
            aria-invalid={Boolean(urlError)}
          />
          {url && !urlError && (
            <LinkPreview 
              url={url} 
              onLoad={handlePreviewLoad}
            />
          )}
          {urlError && (
            <ErrorMessage role="alert" aria-live="polite">
              {urlError}
            </ErrorMessage>
          )}
        </FormGroup>

        {url && !previewDescription && !isPreviewLoading && (
          <FormGroup>
            <Label htmlFor="description">
              <LabelText>
                Описание материала
              </LabelText>
            </Label>
            <TextArea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Краткое описание материала..."
              aria-describedby="description-hint"
            />
            <HintText id="description-hint">
              Опционально: добавьте краткое описание материала
            </HintText>
          </FormGroup>
        )}

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