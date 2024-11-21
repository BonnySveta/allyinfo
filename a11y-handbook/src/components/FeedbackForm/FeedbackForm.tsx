import { useState, FormEvent } from 'react';
import { Toast } from '../Toast/Toast';
import {
  FormContainer,
  StyledForm,
  FormGroup,
  Label,
  TextArea,
  SubmitButton,
  ErrorMessage,
  RequiredMark
} from '../Form/FormComponents';

export function FeedbackForm() {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!feedback.trim()) {
      setError('Пожалуйста, введите ваше сообщение');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: feedback })
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setFeedback('');
      setToast({
        show: true,
        message: 'Спасибо за ваш отзыв!',
        type: 'success'
      });

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

  return (
    <FormContainer>
      <StyledForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="feedback">
            Ваше сообщение
            <RequiredMark aria-label="обязательное поле">*</RequiredMark>
          </Label>
          <TextArea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Напишите ваше сообщение..."
            required
            aria-required="true"
            aria-invalid={Boolean(error)}
          />
          {error && (
            <ErrorMessage role="alert" aria-live="polite">
              {error}
            </ErrorMessage>
          )}
        </FormGroup>

        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? 'Отправка...' : 'Отправить'}
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