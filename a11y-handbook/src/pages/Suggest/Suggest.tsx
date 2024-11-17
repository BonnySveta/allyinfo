import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import styled from 'styled-components';
import { navigationConfig } from '../../config/navigation';
import { Toast } from '../../components/Toast/Toast';
import { LinkPreview } from '../../components/LinkPreview/LinkPreview';

interface FormData {
  section: string;
  url: string;
  description: string;
}

const DRAFT_KEY = 'suggest-form-draft';

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: var(--text-color);
  font-weight: 500;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--input-background);
  color: var(--text-color);
  font-size: 1rem;
  width: 100%;

  &:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--input-background);
  color: var(--text-color);
  font-size: 1rem;
  width: 100%;

  &:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--accent-color-hover);
  }

  &:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
`;

const ErrorMessage = styled.div`
  color: var(--error-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
  margin-left: 0.5rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--input-background);
  color: var(--text-color);
  font-size: 1rem;
  width: 100%;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
`;

const HintText = styled.span`
  color: var(--text-secondary-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const RequiredMark = styled.span`
  color: var(--error-color);
  margin-left: 4px;
`;

const LabelText = styled.span`
  display: inline-flex;
  align-items: center;
`;

const RequiredFieldsHint = styled.p`
  color: var(--text-secondary-color);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
`;

export function Suggest() {
  const [section, setSection] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [urlError, setUrlError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  // Получаем только разделы верхнего уровня без дочерних элементов
  const sections = navigationConfig.filter(item => !item.path.includes('articles'));

  // Загрузка черновика при монтировании
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft) as FormData;
        setSection(parsed.section);
        setUrl(parsed.url);
        setDescription(parsed.description);
      } catch (e) {
        console.error('Failed to parse draft:', e);
      }
    }
  }, []);

  // Сохранение черновика при изменении полей
  useEffect(() => {
    const formData: FormData = {
      section,
      url,
      description
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
  }, [section, url, description]);

  // Очистка черновика после успешной отправки
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
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

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('URL input changed:', value);
    setUrl(value);
    if (value) {
      console.log('Validating URL:', value);
      validateUrl(value);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    if (!section || !url) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    if (!validateUrl(url)) {
      return;
    }

    setIsLoading(true);

    try {
      // Имитация отправки данных
      await new Promise(resolve => setTimeout(resolve, 1000));
      clearDraft(); // Очищаем черновик после успешной отправки
      
      setToast({
        show: true,
        message: 'Материал успешно предложен!',
        type: 'success'
      });
      
      // Очистка формы
      setSection('');
      setUrl('');
      setDescription('');
    } catch (err) {
      setToast({
        show: true,
        message: 'Произошла ошибка при отправке формы',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Предупреждение при уходе со страницы
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (section || url || description) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [section, url, description]);

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  return (
    <FormContainer>
      <h1>Предложить материал</h1>
      <RequiredFieldsHint>
        Поля, отмеченные <RequiredMark>*</RequiredMark>, обязательны для заполнения
      </RequiredFieldsHint>
      
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
          {url && !urlError && <LinkPreview url={url} />}
          {urlError && (
            <ErrorMessage role="alert" aria-live="polite">
              {urlError}
            </ErrorMessage>
          )}
        </FormGroup>

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